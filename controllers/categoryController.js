const { Category } = require('../models')


const getList = async ctx => {
    const rows = await Category.findAll({
        order: [
            ['category_id', 'DESC']
        ]
    });

    ctx.body = {
        success: true,
        data: rows
    }
}


const create = async ctx => {
    const { title } = ctx.request.body;

    if (!title) return ctx.throw(400, "title не передан")

    const category = await Category.create({ title });
    if (!category) ctx.throw(400, "Ошибка при создании category")

    ctx.status = 201;
    ctx.body = { success: true, data: category }
}

const update = async ctx => {
    const { id } = ctx.params;
    const data = ctx.request.body;

    const result = await Category.update(data, { where: { category_id: id } });

    ctx.body = { success: !!result[0] }
}

const remove = async ctx => {
    const { id } = ctx.params;

    const result = await Category.destroy({ where: { category_id: id } });

    ctx.body = { success: !!result }
}

module.exports = {
    getList,
    create,
    update,
    remove
}