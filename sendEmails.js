require("dotenv").config();
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const { exit } = require("process");

// --- CONFIG ---------------------------------------------------------------
const SHEET_NAME = "Recruiters_Email"; // Sheet/tab name to read from
const MIN_DELAY_MS = 45000; // Min gap between emails (45s)
const MAX_DELAY_MS = 90000; // Max gap between emails (90s)

const {
  RESUME_LINK,
  LINKEDIN_LINK,
  SENDER_EMAIL,
  SENDER_PASS,
  CONTACT_NO,
  SENDER_NAME,
  EXCEL_PATH,
} = process.env;

// --- LOAD DATA -------------------------------------------------------------
const workbook = xlsx.readFile(EXCEL_PATH);
const worksheet = workbook.Sheets[SHEET_NAME];
if (!worksheet) {
  console.error(`Sheet "${SHEET_NAME}" not found in ${EXCEL_PATH}`);
  exit(1);
}
const data = xlsx.utils.sheet_to_json(worksheet);

// --- MAIL SETUP --------------------------------------------------------------
const newTransporter = () => {
  return nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASS,
    },
  });
};
const transporter = newTransporter();

const buildEmailBody = ({ name, Company, Role, Link }) => `
<p>Hi ${name},</p>

<p>I'm <b>${SENDER_NAME}</b>, a <b>Frontend Lead</b> with <b>10+ years</b> of experience. I saw your post that <b>${Company}</b> is hiring for <b>${Role}</b> and wanted to reach out directly:</p>

<p>Quick snapshot:</p>
<ul>
<li><b>10+ years</b> in Frontend Engineering, specializing in <b>Angular, TypeScript & JavaScript</b></li>
<li>Currently <b>leading a team of 4 engineers</b> on Morgan Stanley (via Synechron), owning <b>architecture, delivery & code reviews</b> — recognized with <b>client appreciation</b> for the engagement</li>
<li>Deep expertise in <b>RxJS, NgRx, REST API integration, AEM frontend, Node.js, CI/CD</b></li>
<li>Built <b>Generative AI features</b> using <b>OpenAI/LLM & SSE streaming</b>, cutting query resolution time by <b>25%</b></li>
<li>Delivered <b>real-time systems</b> on <b>WebSockets & Node.js</b>, supporting <b>25K+ sessions/month</b></li>
</ul>

<p>I am <b>currently available and can join within a month</b>. Would you be open to a <b>quick 10-min call this week</b> to discuss this opportunity?</p>

<p>PS: My <b><a href="${RESUME_LINK}">Resume</a></b> & <b><a href="${LINKEDIN_LINK}">LinkedIn</a></b> are linked above — happy to share more details.${Link ? ` My <a href="${Link}">${Role}</a> opening is here too.` : ""}</p>

<p>Thanks & Regards,<br>
<b>${SENDER_NAME}</b><br>
Contact No: ${CONTACT_NO}<br>
Email: ${SENDER_EMAIL}</p>`;

const sendEmail = async (row) => {
  const { Name, Company, Email, Role, Link, isSend } = row; // Adjust to your excel column headers
  if (isSend?.toLowerCase() === "no") {
    console.warn("Skipped:", Email);
    return;
  }
  if (!Email || !Name || !Company || !Role) {
    console.warn("Skipping row with missing required fields:", row);
    return;
  }
  const name = Name.split(" ")[0];
  const mailOptions = {
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: Email,
    subject: `Request for an Interview Opportunity - ${Role} at ${Company}`,
    html: buildEmailBody({ name, Company, Role, Link }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", Email);
  } catch (error) {
    console.error("Error sending email to", Email, error.message);
  }
};

const randomDelay = () =>
  MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

const sendEmailsSequentially = async () => {
  for (const row of data) {
    await sendEmail(row);
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  }
  console.log("Done sending mails");
  exit();
};

sendEmailsSequentially();
