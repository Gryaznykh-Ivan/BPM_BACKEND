const { Faq } = require('../models');

const getList = async ctx => {
    const faq = await Faq.findAll({});

    ctx.body = { success: true, data: faq }
}

const create = async ctx => {
    const { question, reply="В разработке" } = ctx.request.body;

    if (!question) return ctx.throw(400, "question не передан")

    const faq = await Faq.create({ question, reply });
    if (!faq) return ctx.throw(400, "Ошибка при создании faq")

    ctx.status = 201;
    ctx.body = { success: true, data: faq }
}

const update = async ctx => {
    const { id } = ctx.params;
    const { question, reply } = ctx.request.body;

    const result = await Faq.update({ question, reply }, { where: { faq_id: id } });

    ctx.body = { success: !!result[0] }
}

const remove = async ctx => {
    const { id } = ctx.params;

    const result = await Faq.destroy({ where: { faq_id: id } });

    ctx.body = { success: !!result }
}

module.exports = {
    getList,
    create,
    update,
    remove
}