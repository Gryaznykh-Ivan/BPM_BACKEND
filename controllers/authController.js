const bcrypt = require('bcrypt');
const { enc, AES } = require("crypto-js");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { User, Refresh_token } = require('../models');
const { sendVerificationLink } = require('./mailController');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET,
        { expiresIn: process.env.STATE === 'production' ? '15m' : '7d' }
    )
}

const confirmRegistration = async ctx => {
    const { encryptedId } = ctx.params;

    const id = AES.decrypt(decodeURIComponent(encryptedId), process.env.SECRET).toString(enc.Utf8);

    const user = await User.findByPk(id);
    if (!user) {
        return ctx.throw(400, "Пользователь не найден")
    }

    if (user.verified != 0) {
        return ctx.throw(400, "Пользователь уже подтвердил регистрацию")
    }

    user.verified = 1;
    await user.save();

    ctx.redirect(`https://${process.env.SITE_BASE}/`);
}

const register = async ctx => {
    const { email, password } = ctx.request.body;

    if (!validator.isEmail(email)) {
        return ctx.throw(400, "Email указан неверно")
    }

    if (!validator.isStrongPassword(password)) {
        return ctx.throw(400, "Пароль должен содержать не менее 1 символa, не менее 1 цыфры, не менее 1 буквы в верхнем регистре")
    }

    const user = await User.findOne({ where: { name: email } });
    if (user) {
        return ctx.throw(400, "Пользователь с таким email уже существует")
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await User.create({ email, name: email, password: hash });

        await sendVerificationLink(email, AES.encrypt(user.user_id.toString(), process.env.SECRET).toString());

        ctx.body = {
            success: true
        }
    } catch (err) {
        ctx.throw(400, 'Ошибка создания аккаунта');
    };
}

const login = async ctx => {
    const { email, password } = ctx.request.body;

    const user = await User.findOne({ where: { name: email } });
    if (!user) {
        return ctx.throw(400, "Пользователя с таким email не существует")
    }

    if (user.verified != 1) {
        return ctx.throw(400, "Для завершения регистрации необходимо подтвердить почту")
    }

    const comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
        return ctx.throw(400, "Пароль введен неверно")
    }

    try {
        const refresh = uuid();
        await Refresh_token.create({ token: refresh, user_id: user.user_id });

        ctx.body = {
            success: true,
            token: generateJwt(user.user_id, user.name, user.role),
            refresh_token: refresh
        }
    } catch (err) {
        ctx.throw(400, 'Ошибка авторизации');
    };
}

const refresh = async ctx => {
    const { refresh_token } = ctx.request.body;

    const refresh = await Refresh_token.findOne({
        where: { token: refresh_token },
        include: { model: User, as: "User" }
    });

    if (!refresh || !refresh.User) {
        return ctx.throw(400, 'Refresh_token указан неверно');
    }

    try {
        const newRefresh = uuid();
        await refresh.update({ date: Date.now(), token: newRefresh });

        ctx.body = {
            success: true,
            token: generateJwt(refresh.User.user_id, refresh.User.name, refresh.User.role),
            refresh_token: newRefresh
        }
    } catch (err) {
        ctx.throw(400, 'Ошибка создания новой пары токенов');
    };
}

module.exports = {
    register,
    login,
    refresh,
    confirmRegistration
}