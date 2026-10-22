# Connect the contact form to Google Sheets

The supplied Google Sheet ID is already in `Code.gs`, and the supplied Apps Script deployment URL is already in the website API. No secret or environment variables are required.

1. Paste the updated contents of `Code.gs` into your Apps Script project and save. The script creates a `Website Lead Form Data` tab on the first enquiry. If that tab already contains different data, choose another `SHEET_NAME` to preserve it.
2. Select **Deploy → Manage deployments → Edit → Version: New version**. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and authorize Google Sheets access. The spreadsheet itself can stay private. Use **Deploy → New deployment → Web app** if no deployment exists.
3. Deploy the updated website code to Vercel so the `/api/leads` function is available.
4. Submit a clearly marked test enquiry from `/contact`. Check the `Website Lead Form Data` tab for all five fields, timestamp, source, and submission ID. The form clears only after Google confirms the save.

If you create a different Apps Script deployment, update the URL in `api/leads.js`, or optionally override it with `GOOGLE_SHEETS_WEB_APP_URL` in Vercel. Use `npm run dev` for local testing; its middleware runs the same lead handler as Vercel. The static `vite preview` command serves only the frontend.

Google deployment access must allow **Anyone** before public website submissions can work. Opening the URL without signing in should return a JSON health message after this script is deployed.

The website posts JSON to `/api/leads`. This function validates the fields, forwards URL-encoded form data to Apps Script, and confirms the save response. Retrying unchanged form data uses the same submission ID, so it does not create duplicate rows. The public endpoint accepts enquiries without a shared secret.

References: [Google web app deployments](https://developers.google.com/apps-script/guides/web), [Vercel Functions with Vite](https://vercel.com/docs/frameworks/frontend/vite).
