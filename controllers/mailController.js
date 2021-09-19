const mailer = require('../mailer');

const sendVerificationLink = async (to, userId) => {
    const message = {
        to,
        from: 'support@bpmdrop.com',
        subject: 'Подтверждение почты на сайте bpmdrop.com',
        html: `
        <p>Перейдите по следующей ссылке, чтобы подтвердить регистрацию на сайте bpmdrop.com.</p>
        <a style="font-size:120%" href="https://api.${process.env.SITE_BASE}/auth/confirmRegistration/${encodeURIComponent(userId)}">Подтвердить регистрацию</a>
        `
    };

    return await mailer.sendMail(message);
}

const sendMail = async (to, subject, text) => {
    const message = {
        from: 'support@bpmdrop.com',
        to, subject, text
    };

    return await mailer.sendMail(message);
}


module.exports = {
    sendVerificationLink,
    sendMail
}