const fs = require('fs');
const mime = require('mime-types')
const path = require('path');
const { User, Replenishment_history, Bits_history } = require('../models');

const profile = async ctx => {
    const { id } = ctx.request.token;

    const user = await User.findByPk(id, {
        attributes: { exclude: ['vk_id', 'role', 'password'] },
        include: [
            { model: Replenishment_history, as: "Replenishment_history", limit: 20 },
            { model: Bits_history, as: "Bits_history", limit: 20  }
        ]
    });

    if (!user) {
        return ctx.throw(404, "Пользователь не найден");
    }

    ctx.body = {
        success: true,
        data: user
    }
}

const replenishment_history = async ctx => {
    const { id } = ctx.request.token;
    const { skip=0, limit=20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        return ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Replenishment_history.findAndCountAll({
        where: { user_id: id },
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

const bits_history = async ctx => {
    const { id } = ctx.request.token;
    const { skip=0, limit=20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        return ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Bits_history.findAndCountAll({
        where: { user_id: id },
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

const changeName = async ctx => {
    const { id } = ctx.request.token;
    const { newName } = ctx.request.body;

    const user = await User.findByPk(id);
    if (!user) {
        return ctx.throw(404, "Пользователь не найден");
    }

    user.name = newName;
    await user.save();

    ctx.body = {
        success: true
    }
}

const changePhoto = async ctx => {
    const { file } = ctx.request.files;

    console.log(bodyPromise );

    fs.renameSync(path.join(__dirname, file.path), '/static/images/' + file.name);
    ctx.body = {message: true}
}

module.exports = {
    profile,
    replenishment_history,
    bits_history,
    changeName,
    changePhoto
}