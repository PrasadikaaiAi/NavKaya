// Copy the ID between /d/ and /edit in your Google Sheet URL.
const SPREADSHEET_ID = '1H5tUBE2qioxKt-mVE6YpHFz3oSpRpqHeBYKC9-wQJwI';
const SHEET_NAME = 'Website Lead Form Data';
const HEADERS = [
  'Received at', 'Full name', 'Phone number', 'City',
  'Pin Code', 'Project details', 'Source', 'Submission ID',
];

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonResponse({ message: 'NavKaya lead endpoint is running.' });
}

function doPost(e) {
  let lock;
  try {
    const data = e.parameter || {};
    if (!data.name || !data.phone || !data.city || !data.pinCode
      || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(data.requestId || '')) {
      return jsonResponse({ success: false, error: 'Missing or invalid enquiry fields.' });
    }

    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME)
      || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
    } else {
      const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
      if (existing.join('\t') !== HEADERS.join('\t')) {
        throw new Error('The destination tab has different headers. Use a new empty tab.');
      }
    }

    // Retrying the same enquiry must not create another row.
    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && sheet.getRange(2, 8, lastRow - 1, 1)
      .createTextFinder(data.requestId).matchEntireCell(true)
      .useRegularExpression(false).findNext()) {
      return jsonResponse({ success: true, requestId: data.requestId });
    }

    // Keep phone numbers and pin codes as text and prevent formula execution.
    const asText = (value) => {
      const text = String(value || '').trim();
      return /^[=+\-@]/.test(text) ? "'" + text : text;
    };
    const row = lastRow + 1;
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    const target = sheet.getRange(row, 1, 1, HEADERS.length);
    target.setNumberFormat('@');
    sheet.getRange(row, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    target.setValues([[
      new Date(), asText(data.name), asText(data.phone), asText(data.city),
      asText(data.pinCode), asText(data.details), 'Contact us', data.requestId,
    ]]);
    SpreadsheetApp.flush();

    return jsonResponse({ success: true, requestId: data.requestId });
  } catch (error) {
    console.error(error.message);
    return jsonResponse({ success: false, error: 'Unable to save enquiry.' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
