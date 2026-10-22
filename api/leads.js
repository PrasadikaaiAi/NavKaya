const failureMessage = 'We could not save your enquiry. Please try again.'
const defaultWebhookUrl = 'https://script.google.com/macros/s/AKfycbzJqLLUWSD-jEF_HyYQFkX48hnK-IHYa2H70Q0R6BFePYB02G71CalN5tv-J3ozTinQJg/exec'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid enquiry.' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ success: false, error: 'Invalid enquiry.' })
  }

  const lead = {}
  for (const [key, maxLength] of Object.entries({ name: 120, phone: 30, city: 100, pinCode: 6, details: 5000, requestId: 36 })) {
    if ((key !== 'details' || body[key] != null) && typeof body[key] !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid enquiry fields.' })
    }
    lead[key] = (body[key] || '').trim()
    if (lead[key].length > maxLength) {
      return res.status(400).json({ success: false, error: 'Enquiry fields are too long.' })
    }
  }

  const phoneDigits = lead.phone.replace(/\D/g, '')
  if (!lead.name || !lead.city || !/^[+\d ()-]+$/.test(lead.phone)
    || phoneDigits.length < 7 || phoneDigits.length > 15 || !/^[1-9]\d{5}$/.test(lead.pinCode)
    || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(lead.requestId)) {
    return res.status(400).json({ success: false, error: 'Please check your name, phone number, city, and pin code.' })
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL || defaultWebhookUrl
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(webhookUrl)) {
    return res.status(503).json({ success: false, error: failureMessage })
  }

  try {
    // Follow Google's response redirect and confirm the row was saved.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: new URLSearchParams({ ...lead, source: 'Contact us' }),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    const result = await response.json()
    if (!response.ok || result.success !== true || result.requestId !== lead.requestId) {
      return res.status(502).json({ success: false, error: failureMessage })
    }
    return res.status(200).json({ success: true })
  } catch {
    return res.status(502).json({ success: false, error: failureMessage })
  }
}
