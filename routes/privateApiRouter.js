const Router = require('koa-router');
const userController = require('../controllers/userController');
const caseController = require('../controllers/caseController');
const bitController = require('../controllers/bitController');

const router = new Router().prefix('/api');

// userController
router.get('/user/profile', userController.profile);
router.get('/user/replenishment_history', userController.replenishment_history);
router.get('/user/bits_history', userController.bits_history);
router.put('/user/changeName', userController.changeName);
router.put('/user/changePhoto', userController.changePhoto);

// caseController
router.post('/case/open/:id', caseController.open);

// bitController
router.get('/bit/download', bitController.download);



module.exports = router.routes();