import nodemailer from 'nodemailer';
import config from './config';

/**
 * Exporting a default object that creates a transport for sending emails
 */
export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD_APP
    }
});