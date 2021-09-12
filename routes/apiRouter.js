const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new Router().prefix('/api');

router.post('/getDays', async ctx => {
    
});

router.post('/getLessons', async ctx => {
    
});



module.exports = router.routes();