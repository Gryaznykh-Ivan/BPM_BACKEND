const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 25,
    host: 'localhost',
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;