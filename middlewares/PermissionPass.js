const jwt = require('jsonwebtoken');

const roles = {
    user: 0,
    admin: 1
}

module.exports = async (ctx, next) => {
    try {
        const { role } = ctx.request.token;

        if (role !== roles.admin)
        {
            return ctx.throw(403, "Доступ запрещен");
        }

        return next();
    } catch(err) {
        ctx.throw(403, err.message);
    }
}