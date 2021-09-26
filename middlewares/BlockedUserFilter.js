
module.exports = async (ctx, next) => {
    try {
        const { blocked } = ctx.request.token;

        if (blocked === 1)
        {
            return ctx.throw(403, "Пользователь заблокирован");
        }

        return next();
    } catch(err) {
        ctx.throw(403, err.message);
    }
}