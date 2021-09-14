const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');

const router = new Router().prefix('/api');

// faqController
router.post('/faq/create', faqController.create);
router.put('/faq/update/:id', faqController.update);
router.delete('/faq/delete/:id', faqController.remove);

// supportController
router.get('/support/getList', supportController.getList);
router.get('/support/get', supportController.get);

module.exports = router.routes();