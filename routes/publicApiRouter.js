const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');
const caseController = require('../controllers/caseController');

const router = new Router().prefix('/api');

// faqController
router.get('/faq/getAll', faqController.getAll);

// supportController
router.post('/support/create', supportController.create);

// caseController
router.get('/case/getCasesByCategories', caseController.getCasesByCategories);


module.exports = router.routes();