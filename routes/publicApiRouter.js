const Router = require('koa-router');
const faqController = require('../controllers/faqController');

const router = new Router().prefix('/api');

router.get('/faq/getAll', faqController.getAll);


module.exports = router.routes();