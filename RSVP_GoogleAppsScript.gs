/**
 * RSVP Google Apps Script
 * Deploy as Web App (Execute as: Me; Who has access: Anyone)
 * 
 * Spreadsheet ID: 1-S4CUAW9mG1ffnEvTLTK9Oc3mqigeb4cD0U3agOOLYc
 * 
 * Installation Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Copy this entire file into the script editor
 * 4. Save the project
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type "Web app"
 * 7. Set "Execute as" to your Google account
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the deployment URL
 * 11. Open js/menikah.js and replace:
 *     const RSVP_ENDPOINT = "PASTE_WEB_APP_URL_HERE";
 *     with the deployment URL
 */

const SPREADSHEET_ID = "1-S4CUAW9mG1ffnEvTLTK9Oc3mqigeb4cD0U3agOOLYc";
const SHEET_NAME = "RSVP Responses";

// Handle POST requests
function doPost(e) {
  try {
    // Parse the JSON body
    const payload = JSON.parse(e.postData.contents);
    
    // Get or create the sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
    // Create headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Side",
        "Full Name",
        "Phone",
        "Guests",
        "Message",
        "User Agent",
        "Page URL"
      ];
      sheet.appendRow(headers);
    }
    
    // Prepare the data row
    const timestamp = new Date().toLocaleString();
    const newRow = [
      timestamp,
      payload.side || "",
      payload.fullName || "",
      payload.phone || "",
      payload.guests || "",
      payload.message || "",
      payload.userAgent || "",
      payload.pageUrl || ""
    ];
    
    // Append the data to the sheet
    sheet.appendRow(newRow);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Log error for debugging
    Logger.log("Error in doPost: " + error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "RSVP endpoint ready" }))
    .setMimeType(ContentService.MimeType.JSON);
}
