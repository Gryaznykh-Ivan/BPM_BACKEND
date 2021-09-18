const Router = require('koa-router');
const authController = require('../controllers/authController');

const router = new Router().prefix('/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);

module.exports = router.routes();