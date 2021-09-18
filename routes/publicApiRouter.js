const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');

const router = new Router().prefix('/api');

// faqController
router.get('/faq/getAll', faqController.getAll);

// supportController
router.post('/support/create', supportController.create);


module.exports = router.routes();