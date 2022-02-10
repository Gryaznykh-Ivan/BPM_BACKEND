const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');
const caseController = require('../controllers/caseController');

const router = new Router().prefix('/api');

// faqController
router.get('/faq/getList', faqController.getList);

// supportController
router.post('/support/create', supportController.create);

// caseController
router.get('/case/getCasesByCategories', caseController.getCasesByCategories);
router.get('/case/getCaseContent/:id', caseController.getCaseContent);


module.exports = router.routes();