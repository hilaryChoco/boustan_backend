require("dotenv").config();

module.exports = {
  emailConfig: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false }
    },
    from: process.env.EMAIL_FROM,
  }
}