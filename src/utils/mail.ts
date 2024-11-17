import nodemailer from 'nodemailer';

import { NODEMAILER_EMAIL, NODEMAILER_EMAIL_PASSWORD } from '@/config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_EMAIL_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to,
    subject,
    text,
  });
};
