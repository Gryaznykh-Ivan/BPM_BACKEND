const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');
const caseController = require('../controllers/caseController');
const licenseController = require('../controllers/licenseController');

const router = new Router().prefix('/api');

// faqController
router.post('/faq/create', faqController.create);
router.put('/faq/:id/update', faqController.update);
router.delete('/faq/:id/delete', faqController.remove);

// supportController
router.get('/support/getList', supportController.getList);
router.get('/support/get/:id', supportController.get);
router.post('/support/reply', supportController.reply);

// caseController 
router.get('/case/getList', caseController.getList);
router.post('/case/create', caseController.create);
router.post('/case/:id/addLicese', caseController.addLicense);

router.put('/case/:id/edit', caseController.edit);
router.put('/case/:id/changeLicenseProbability', caseController.changeLicenseProbability);
router.put('/case/:id/changePhoto', caseController.changePhoto);

router.delete('/case/:id/removeLicense', caseController.removeLicense);
router.delete('/case/:id/remove', caseController.remove);

// licenseController
router.get('/license/getList', licenseController.getList);

module.exports = router.routes();