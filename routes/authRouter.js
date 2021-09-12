const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

const router = new Router().prefix('/auth');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh', userController.refresh);

module.exports = router.routes();