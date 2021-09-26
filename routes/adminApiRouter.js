const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');
const caseController = require('../controllers/caseController');

const router = new Router().prefix('/api');

// faqController
router.post('/faq/create', faqController.create);
router.put('/faq/update/:id', faqController.update);
router.delete('/faq/delete/:id', faqController.remove);

// supportController
router.get('/support/getList', supportController.getList);
router.get('/support/get/:id', supportController.get);
router.post('/support/reply', supportController.reply);

// caseController 
router.get('/case/getList', caseController.getList);
router.post('/case/create', caseController.create);
router.put('/case/edit', caseController.edit);
router.put('/case/changePhoto', caseController.changePhoto);
router.delete('/case/remove', caseController.remove);

module.exports = router.routes();