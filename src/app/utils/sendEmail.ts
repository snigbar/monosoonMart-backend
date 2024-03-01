import nodemailer from 'nodemailer';
import config from '../configs/config';

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: 587,
  secure: config.app_enviroment === 'production', // `true` for port 465, `false` for all other ports
  auth: {
    user: config.smtp_sender_email,
    pass: config.smtp_mail_pass,
  },
});

const sendEmail = async (
  subject: string,
  text: string,
  to: string,
  html: string,
) => {
  await transporter.sendMail({
    from: config.smtp_sender_email, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html,
  });
};

export default sendEmail;
