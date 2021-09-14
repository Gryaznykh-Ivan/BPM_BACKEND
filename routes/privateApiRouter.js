const Router = require('koa-router');
const userController = require('../controllers/userController');

const router = new Router().prefix('/api');

// userController
router.get('/user/profile', userController.profile);
router.get('/user/replenishment_history', userController.replenishment_history);
router.get('/user/bits_history', userController.bits_history);
router.put('/user/changeName', userController.changeName);
router.put('/user/changePhoto', userController.changePhoto);



module.exports = router.routes();