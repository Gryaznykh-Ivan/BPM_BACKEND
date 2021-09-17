const { BaseError } = require('sequelize');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch(err) {
        if (err instanceof BaseError) {
            ctx.throw(400, err.message);
        }

        throw err;
    }
}