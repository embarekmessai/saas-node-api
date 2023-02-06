import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config()

type SMTP = {
    transport: string;
    host: string;
    port: string | number;
    encryption: string;
    username: string;
    password: string;
    timeout: string | null;
    local_domain: string;
}

type Sender = {
    from: string;
    name: string;
}
interface Mail {
    default: string;
    smtp: SMTP;
    sender: Sender
}

export const mailer: Mail = {
    //Default Mailer
    default: process.env.MAIL_MAILER || "smtp",

    smtp : {
        transport: 'smtp',
        host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.MAIL_PORT || 2525,
        encryption: process.env.MAIL_ENCRYPTION || 'tls',
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        timeout: null,
        local_domain: process.env.MAIL_EHLO_DOMAIN,
    },

    sender : {
        from: process.env.MAIL_FROM_ADDRESS || "hello@example.com",
        name: process.env.MAIL_FROM_NAME || "APP EMBAREK"
    }
    
    
};

export const mailTransport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });