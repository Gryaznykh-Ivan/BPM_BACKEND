const Router = require('koa-router');

const JwtParser = require('../middlewares/JwtParser');

const authRouter = require('./authRouter');
const apiRouter = require('./apiRouter')

const router = new Router();

router.use(authRouter);
router.use(JwtParser);
router.use(apiRouter);

module.exports = router;