const Router = require('koa-router');
const faqController = require('../controllers/faqController');

const router = new Router().prefix('/api');

router.post('/faq/create', faqController.create);
router.put('/faq/update/:id', faqController.update);
router.delete('/faq/delete/:id', faqController.remove);


module.exports = router.routes();