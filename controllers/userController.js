const bcrypt = require('bcrypt')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const { user, bit } = require('../models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '15m'}
    )
}

const register = async ctx => {
    const { email, password } = ctx.request.body;

    if (!validator.isEmail(email))
    {
        ctx.status = 400;
        ctx.body = { success: false }
        return
    }

    const User = await user.findOne({ where: { name: email } });
    if (User) {
        ctx.status = 400;
        ctx.body = { success: false }
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    try {
        await user.create({name: email, password: hash });

        ctx.body = { success: true }
    } catch(err) {
        console.log(err);
        ctx.throw(400, 'Account was not created');
    };
}

const login = async ctx => {

}

const refresh = async ctx => {

}

module.exports = {
    register,
    login,
    refresh
}