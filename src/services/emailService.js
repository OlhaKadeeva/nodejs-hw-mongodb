import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//  Создаем транспортер
const port = parseInt(process.env.SMTP_PORT, 10);
const secure = port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Функция отправки письма сброса пароля
export const sendResetEmail = async (email, token, name = 'Користувач') => {
  console.log('📨 Sending email to:', email);

  try {
    // Путь к шаблону
    const templatePath = path.join(
      __dirname,
      '../templates/reset-password-email-template.html',
    );

    // Проверка существования шаблона
    if (!fs.existsSync(templatePath)) {
      throw new Error('Email template file not found.');
    }

    // Читаем и компилируем шаблон
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);

    // Генерация ссылки сброса
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
    const html = template({
      name,
      link: resetLink,
    });

    // Настройки письма
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    };

    // Отправка письма
    console.log('Sending email to:', email);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', email);
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error('Failed to send the email, please try again later.');
  }
};
