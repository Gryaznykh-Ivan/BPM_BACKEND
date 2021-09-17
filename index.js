require('dotenv').config();
const koa = require('koa');
const sequelize = require('./db');
const models = require('./models');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const sequelizeErrorHandler = require('./handlers/sequelizeErrorHandler');

const router = require('./routes');
 
const app = new koa();


app.use(sequelizeErrorHandler)

app.use(bodyParser());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(process.env.PORT, () => console.log(`Server started on port ${ process.env.PORT }`))
    } catch (e) {
        console.log(e)
    }
}

start();