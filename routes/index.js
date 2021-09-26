const Router = require('koa-router');

const JwtParser = require('../middlewares/JwtParser');
const PermissionPass = require('../middlewares/PermissionPass');
const BlockedUserFilter = require('../middlewares/BlockedUserFilter');

const authRouter = require('./authRouter');
const adminApiRouter = require('./adminApiRouter')
const publicApiRouter = require('./publicApiRouter')
const privateApiRouter = require('./privateApiRouter')

const router = new Router();

router.use(authRouter);
router.use(publicApiRouter);
router.use(JwtParser); // Фильтрует запросы без токена
router.use(BlockedUserFilter); // Фильтрует заблокированных пользователей
router.use(privateApiRouter);
router.use(PermissionPass); // Фильтрует запросы без role=admin
router.use(adminApiRouter);

module.exports = router;