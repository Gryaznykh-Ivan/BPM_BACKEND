const { License_type } = require('../models')


const getList = async ctx => {
    const rows = await License_type.findAll({});

    ctx.body = {
        success: true,
        data: rows
    }
}


module.exports = {
    getList
}