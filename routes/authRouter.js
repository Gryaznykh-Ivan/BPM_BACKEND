const Router = require('koa-router');
const authController = require('../controllers/authController');

const router = new Router().prefix('/auth');

router.get('/confirmRegistration/:encryptedId', authController.confirmRegistration);
router.get('/vk', authController.vk);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);

module.exports = router.routes();