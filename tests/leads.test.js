import { afterEach, beforeEach, test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import handler from '../api/leads.js'

const lead = {
  name: 'Test enquiry', phone: '+91 98765 43210', city: 'Jaipur',
  pinCode: '302001', details: 'Bathroom renovation\nNext month',
  requestId: 'ed33f53d-3de9-41e1-b2d4-c221e4a948a7',
}
const originalEnv = { ...process.env }
beforeEach(() => {
  process.env.GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/test/exec'
})
afterEach(() => {
  mock.restoreAll()
  for (const key of ['GOOGLE_SHEETS_WEB_APP_URL']) {
    if (originalEnv[key] === undefined) delete process.env[key]
    else process.env[key] = originalEnv[key]
  }
})

function response() {
  return {
    headers: {}, code: 200, body: null,
    setHeader(key, value) { this.headers[key] = value },
    status(code) { this.code = code; return this },
    json(body) { this.body = body; return this },
  }
}

// Simulate only the Google services used by Code.gs; no network or real leads.
function appsScript() {
  const rows = []
  let locked = false
  const sheet = {
    getLastRow: () => rows.length,
    getMaxRows: () => 1000,
    setFrozenRows() {},
    getRange(row, column, height = 1, width = 1) {
      return {
        setNumberFormat() { return this },
        getValues() { return rows.slice(row - 1, row - 1 + height).map(r => r.slice(column - 1, column - 1 + width)) },
        setValues(values) {
          values.forEach((valuesRow, offset) => {
            rows[row - 1 + offset] ||= []
            valuesRow.forEach((value, col) => { rows[row - 1 + offset][column - 1 + col] = value })
          })
          return this
        },
        createTextFinder(value) {
          return {
            matchEntireCell() { return this },
            useRegularExpression() { return this },
            findNext: () => rows.slice(row - 1).find(r => r[column - 1] === value) || null,
          }
        },
      }
    },
  }
  const context = {
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (text) => ({ text, setMimeType() { return this } }),
    },
    LockService: { getScriptLock: () => ({
      waitLock() { locked = true }, hasLock: () => locked,
      releaseLock() { locked = false },
    }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
    console: { error() {} },
  }
  vm.runInNewContext(readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8'), context)
  return { rows, context, submit: data => JSON.parse(context.doPost({ parameter: data }).text) }
}

test('API forwards every field; Apps Script saves one row and deduplicates retries', async () => {
  const script = appsScript()
  mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, process.env.GOOGLE_SHEETS_WEB_APP_URL)
    assert.equal(options.method, 'POST')
    assert.equal(options.redirect, 'follow')
    const payload = Object.fromEntries(options.body)
    assert.equal(payload.secret, undefined)
    assert.equal(payload.details, lead.details)
    return { ok: true, json: async () => script.submit(payload) }
  })
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = response()
    await handler({ method: 'POST', body: JSON.stringify(lead) }, res)
    assert.equal(res.code, 200)
    assert.deepEqual(res.body, { success: true })
    assert.equal(res.headers['Cache-Control'], 'no-store')
  }
  assert.equal(script.rows.length, 2)
  assert.deepEqual(Array.from(script.rows[1].slice(1)), [
    lead.name, "'" + lead.phone, lead.city, lead.pinCode, lead.details, 'Contact us', lead.requestId,
  ])
  assert.ok(Number.isFinite(script.rows[1][0].getTime()))
})

test('invalid requests cannot reach Google', async () => {
  const fetch = mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected call') })
  for (const body of ['{bad json', null, [], { ...lead, phone: 'invalid' }, { ...lead, pinCode: '123' }, { ...lead, details: 'x'.repeat(5001) }]) {
    const res = response()
    await handler({ method: 'POST', body }, res)
    assert.equal(res.code, 400)
  }
  assert.equal(fetch.mock.callCount(), 0)
  const res = response()
  await handler({ method: 'GET' }, res)
  assert.equal(res.code, 405)
})

test('invalid configuration and failed or unconfirmed Google responses never report success', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ success: true, requestId: 'wrong-id' }) }))
  let res = response()
  process.env.GOOGLE_SHEETS_WEB_APP_URL = 'https://example.com/not-the-google-endpoint'
  await handler({ method: 'POST', body: lead }, res)
  assert.equal(res.code, 503)
  assert.equal(fetch.mock.callCount(), 0)
  process.env.GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/test/exec'
  for (const upstream of [
    { ok: true, json: async () => ({ success: false }) },
    { ok: false, json: async () => { throw new SyntaxError('Google sign-in HTML') } },
    { ok: true, json: async () => ({ success: true, requestId: 'wrong-id' }) },
  ]) {
    fetch.mock.mockImplementation(async () => upstream)
    res = response()
    await handler({ method: 'POST', body: lead }, res)
    assert.equal(res.code, 502)
    assert.equal(res.body.success, false)
  }
})

test('Apps Script rejects incomplete enquiries and stores formula-like input as text', () => {
  const script = appsScript()
  assert.equal(script.submit({ ...lead, phone: '' }).success, false)
  assert.equal(script.rows.length, 0)
  assert.equal(script.submit({ ...lead, details: '=IMPORTXML("https://example.com")' }).success, true)
  assert.equal(script.rows[1][5], '\'=IMPORTXML("https://example.com")')
})

test('the provided deployment URL works without environment variables', async () => {
  delete process.env.GOOGLE_SHEETS_WEB_APP_URL
  mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, 'https://script.google.com/macros/s/AKfycbzJqLLUWSD-jEF_HyYQFkX48hnK-IHYa2H70Q0R6BFePYB02G71CalN5tv-J3ozTinQJg/exec')
    return { ok: true, json: async () => ({ success: true, requestId: lead.requestId }) }
  })
  const res = response()
  await handler({ method: 'POST', body: lead }, res)
  assert.equal(res.code, 200)
})
