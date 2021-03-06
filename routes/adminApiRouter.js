const Router = require('koa-router');
const faqController = require('../controllers/faqController');
const supportController = require('../controllers/supportController');
const caseController = require('../controllers/caseController');
const licenseController = require('../controllers/licenseController');
const categoryController = require('../controllers/categoryController');
const bitmakerController = require('../controllers/bitmakerController');
const bitController = require('../controllers/bitController');

const router = new Router().prefix('/api');

// faqController
router.post('/faq/create', faqController.create);
router.put('/faq/:id/update', faqController.update);
router.delete('/faq/:id/delete', faqController.remove);

// supportController
router.get('/support/getList', supportController.getList);
router.get('/support/:id', supportController.get);
router.post('/support/:id/reply', supportController.reply);

// caseController 
router.get('/case/getList', caseController.getList);
router.post('/case/create', caseController.create);
router.get('/case/:id', caseController.get);
router.post('/case/:id/addLicense', caseController.addLicense);
router.put('/case/:id/update', caseController.update);
router.put('/case/:id/changePhoto', caseController.changePhoto);
router.delete('/case/:id/delete', caseController.remove);

router.get('/case/:id/:license_id', caseController.getLicense);
router.post('/case/:id/:license_id/addBit', caseController.addLicenseBit);
router.delete('/case/:id/:license_id/removeBit', caseController.removeLicenseBit);
router.put('/case/:id/:license_id/update', caseController.changeLicenseProbability);
router.delete('/case/:id/:license_id/delete', caseController.removeLicense);

// licenseController
router.get('/license/getList', licenseController.getList);

// categoryController
router.get('/category/getList', categoryController.getList);
router.post('/category/create', categoryController.create);
router.put('/category/:id/update', categoryController.update);
router.delete('/category/:id/delete', categoryController.remove);

// bitmakerController
router.get('/bitmaker/getList', bitmakerController.getList);
router.post('/bitmaker/create', bitmakerController.create);
router.put('/bitmaker/:id/update', bitmakerController.update);
router.put('/bitmaker/:id/changePhoto', bitmakerController.changePhoto);
router.delete('/bitmaker/:id/delete', bitmakerController.remove);

// bitController
router.get('/bit/getList', bitController.getList);
router.get('/bit/getByName', bitController.getByName);
router.post('/bit/create', bitController.create);
router.get('/bit/:id', bitController.get); 
router.post('/bit/:id/addFile', bitController.addFile);
router.put('/bit/:id/update', bitController.update);
router.put('/bit/:id/changePhoto', bitController.changePhoto);
router.delete('/bit/:id/delete', bitController.remove);
router.put('/bit/:id/:file_id/update', bitController.updateFile)
router.delete('/bit/:id/:file_id/delete', bitController.removeFile)

module.exports = router.routes();