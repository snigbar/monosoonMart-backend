import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  salt_rounds: process.env.SALT_ROUNDS,
  smtp_mail_pass: process.env.MAIL_PASSWORD,
  jwt_activate_token: process.env.JWT_ACTIVATE_TOKEN,
  app_enviroment: process.env.ENVIROMENT,
  smtp_host: process.env.SMTP_HOST,
  smtp_sender_email: process.env.SMTP_SENDER_EMAIL,
  client_URL: process.env.FRONTEND_URL,
};
