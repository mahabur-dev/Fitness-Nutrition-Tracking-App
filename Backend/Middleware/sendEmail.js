import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // your Gmail or SMTP email
      pass: process.env.SMTP_PASS, // app password (not your real password)
    },
  });

  await transporter.sendMail({
    from: `"FitLife" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
};
