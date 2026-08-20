# Recruiter Outreach Mailer

A lightweight Node.js script that automates personalized outreach emails to recruiters. It reads recruiter/company details from an Excel sheet and sends templated, personalized emails via Gmail SMTP — with randomized delays between sends to keep sending patterns natural.

## Features

- 📊 Reads recruiter contact details (Name, Company, Role, Email, Link) from an Excel file
- ✉️ Sends personalized HTML emails via Gmail SMTP (Nodemailer)
- ⏱️ Randomized delay between emails to avoid spam flags and stay within Gmail sending limits
- 🔐 Credentials and personal details managed via environment variables — nothing sensitive is hardcoded
- ✅ Skips rows with missing required fields instead of crashing mid-run

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- A Gmail account with **2-Step Verification** enabled
- A Gmail **App Password** (regular account passwords won't work for SMTP) — generate one at [myaccount.google.com → Security → App Passwords](https://myaccount.google.com/apppasswords)

## Setup

1. **Clone the repo and install dependencies**

   ```bash
   npm install
   ```

2. **Create your `.env` file** from the example

   ```bash
   cp .env.example .env
   ```

   Then fill in your details:

   ```env
   SENDER_NAME=Your Name
   SENDER_EMAIL=
   SENDER_PASS=
   CONTACT_NO=
   RESUME_LINK=
   LINKEDIN_LINK=
   EXCEL_PATH=
   ```

3. **Prepare your Excel file** (`list.xlsx` by default), with these columns:

   | Name     | Company  | Role          | Email         | Link (optional) |
   | -------- | -------- | ------------- | ------------- | --------------- |
   | Jane Doe | Acme Inc | Frontend Lead | jane@acme.com | job posting URL |

   > The `Link` column is optional — if present, it's added to the email as a direct link to the job opening.

## Usage

```bash
npm run send
```

This will:

1. Read all rows from the configured sheet
2. Send a personalized email to each recruiter
3. Wait a randomized interval (45–90s by default) between sends
4. Log success/failure for each email to the console
5. Exit automatically once the list is exhausted

## Customizing the Email

The email template lives in the `buildEmailBody` function. Edit the HTML there to update your experience, skills, or tone — placeholders like `${name}`, `${Company}`, and `${Role}` are auto-filled per recruiter from the Excel row.

## Notes & Best Practices

- Gmail's daily sending limit is ~500 emails for regular accounts — space out large lists across multiple days.
- Keep delays randomized rather than fixed to reduce the chance of being flagged as automated/spam.
- Never commit your `.env` file — it's already covered by `.gitignore`.

## Disclaimer

This tool is intended for personal job-search outreach only. Use responsibly and respect recipients' preferences — always include a way to be removed from future contact if sending at any scale.
