const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
    try {
        let token = ctx.request.headers['authorization'];
        if (token && token.length) token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        
        
        ctx.request.token = decoded;

        return next();
    } catch(err) {
        ctx.throw(401, err.message);
    }
}