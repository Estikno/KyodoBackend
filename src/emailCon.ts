import nodemailer from 'nodemailer';
import config from './config';

export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD_APP
    }
});