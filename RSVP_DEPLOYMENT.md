# RSVP System Deployment Guide

## Overview
This wedding invitation website now includes an RSVP system that collects guest information via a modal form and stores it in a Google Sheet.

## Components

### 1. Frontend (Already Implemented)
- **HTML**: RSVP modal form in `index.html`
- **CSS**: Modal styling in `css/menikah.css`
- **JS**: Modal logic and form submission in `js/menikah.js`

### 2. Backend (Google Apps Script)
- File: `RSVP_GoogleAppsScript.gs`
- Handles POST requests from the frontend
- Writes to Google Sheet: https://docs.google.com/spreadsheets/d/1-S4CUAW9mG1ffnEvTLTK9Oc3mqigeb4cD0U3agOOLYc/edit?usp=sharing

---

## Step-by-Step Deployment Instructions

### Step 1: Create a Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New project"
3. Name it something like "Wedding RSVP"
4. A new script editor will open

### Step 2: Copy the Script Code
1. Open the file `RSVP_GoogleAppsScript.gs` in your text editor
2. Copy all the code
3. In the Google Apps Script editor, delete any existing code
4. Paste the copied code
5. Click "Save" (or Ctrl+S / Cmd+S)

### Step 3: Deploy as Web App
1. In the Google Apps Script editor, click "Deploy" (top right)
2. Select "New deployment"
3. Click the dropdown next to "Select type" and choose "Web app"
4. Fill in the deployment settings:
   - **Execute as**: Select your Google account
   - **Who has access**: Select "Anyone"
5. Click "Deploy"
6. You'll see a popup with the deployment URL (looks like: `https://script.google.com/macros/d/...../usercontent`)
7. **Copy this URL** - you'll need it next

### Step 4: Update the Frontend with the Web App URL
1. Open `js/menikah.js` in your text editor
2. Find this line (near the top):
   ```javascript
   const RSVP_ENDPOINT = "PASTE_WEB_APP_URL_HERE";
   ```
3. Replace `"PASTE_WEB_APP_URL_HERE"` with your deployment URL (keep the quotes):
   ```javascript
   const RSVP_ENDPOINT = "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent";
   ```
4. Save the file

### Step 5: Test the RSVP Form
1. Open your wedding invitation website
2. Scroll to the RSVP section
3. Click either "Contact Groom" or "Contact Bride" button
4. You should see a modal form appear
5. Fill in the form and submit
6. You should see a success message (takes 1-2 seconds)
7. Check the Google Sheet - a new row should appear with your submission

---

## Troubleshooting

### Issue: "Failed to fetch" error
- **Cause**: RSVP_ENDPOINT is not set correctly
- **Solution**: Double-check the Web App URL in `js/menikah.js`

### Issue: Form submits but nothing appears in the sheet
- **Cause**: Wrong Spreadsheet ID or Sheet name mismatch
- **Solution**: 
  - Verify the Spreadsheet ID in the script matches the URL
  - Make sure the Sheet is named "RSVP Responses" (or update the script)

### Issue: Getting CORS errors
- **Cause**: Web App deployment permissions
- **Solution**: Re-deploy ensuring "Who has access" is set to "Anyone"

### Issue: New deployment doesn't work
- **Cause**: Using old deployment URL
- **Solution**: Create a new deployment (each new version needs a fresh deployment)

---

## Sheet Structure

The Google Sheet will have the following columns:
| Timestamp | Side | Full Name | Phone | Guests | Message | User Agent | Page URL |
|-----------|------|-----------|-------|--------|---------|------------|----------|
| Date & time | Bride/Groom | Guest name | Phone # | # of guests | Optional note | Browser info | Referrer |

---

## User Experience Flow

1. Guest clicks "Contact Groom" or "Contact Bride"
2. Modal form appears with fields:
   - Full Name (required)
   - Phone Number (required)
   - Number of Guests (required, minimum 1)
   - Message (optional)
3. Guest fills in form and clicks "Submit RSVP"
4. Form validates locally first
5. Shows "Submitting..." button state
6. Sends data to Google Apps Script
7. Script writes to the spreadsheet
8. Guest sees success message for 2 seconds
9. Modal closes

---

## Customization

### Change the Google Sheet
- Update `SPREADSHEET_ID` in the Apps Script file
- Update the URL in deployment instructions

### Change Sheet Name
- Edit `SHEET_NAME = "RSVP Responses"` in the Apps Script

### Add/Remove Form Fields
- Update form fields in `index.html` (inside the modal)
- Update form data in `js/menikah.js` (in the `formData` object)
- Update the Apps Script to handle new fields (in the `newRow` array)

---

## Security Notes

- The Web App is publicly accessible (as intended)
- No authentication is required (anyone can submit)
- Consider adding spam protection if needed
- For sensitive data, consider using Google Forms instead

---

## Questions?

Refer to the comments in the script files for additional details and comments.
