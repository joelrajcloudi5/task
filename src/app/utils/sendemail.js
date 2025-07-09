import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email using nodemailer
 * @param {string} to - recipient email address
 * @param {string} subject - email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
