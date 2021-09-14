const { Support } = require('../models')

const getList = async ctx => {
    const { skip=0, limit=20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        return ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Support.findAndCountAll({
        offset: skip,
        limit,
        order: [
            ['date', 'DESC']
        ]
    })

    ctx.body = {
        success: true,
        data: rows,
        count
    }
}

const get = async ctx => {
    const { id } = ctx.params;

    const support = await Support.findOne({ where: { support_id: id } });
    if (!support) {
        return ctx.throw(404, "Обращений в службу поддержки не найдено");
    }

    if (!support.read) {
        support.read = 1;
        await support.save();
    }

    ctx.body = {
        success: true,
        data: support,
        link: `https://mail.google.com/mail/u/0/?fs=1&to=${ support.email }&su=${ support.title }&tf=cm`
    }
}

const create = async ctx => {
    const { email, title, question } = ctx.request.body;

    const support = await Support.create({ email, title, question });
    if (!support) {
        return ctx.throw(400, "Ошибка при создании запроса");
    }

    ctx.status = 201;
    ctx.body = { success: true, data: support }
}



module.exports = {
    getList,
    get,
    create
}