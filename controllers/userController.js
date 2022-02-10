const fs = require('fs');
const { parseFormData } = require('./formDataController');
const { User, Replenishment_history, Bits_history, Image, Bit, Bitmaker } = require('../models');

const profile = async ctx => {
    const { id } = ctx.request.token;

    const user = await User.findByPk(id, {
        attributes: { exclude: ['vk_id', 'role', 'password', 'photo'] },
        include: [
            { model: Image, as: "photo_image", attributes: { exclude: ['image_id', 'path'] } },
            { model: Replenishment_history, as: "replenishment_histories", limit: 20 },
            {
                model: Bits_history,
                as: "bits_histories",
                limit: 20,
                attributes: ['bits_history_id', 'date', 'license_type'],
                include: {
                    model: Bit,
                    as: "bit",
                    attributes: ['bit_id', 'title'],
                    include: {
                        model: Bitmaker,
                        as: "author_Bitmaker",
                        include: {
                            model: Image,
                            as: "photo_image",
                            attributes: { exclude: ['image_id', 'path'] }
                        }
                    }
                },
                order: [
                    ['date', 'DESC']
                ]
            }
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
    const { skip = 0, limit = 20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        return ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Replenishment_history.findAndCountAll({
        attributes: { exclude: ['user_id'] },
        where: { user_id: id },
        order: [
            ['date', 'DESC']
        ],
        offset: Number(skip),
        limit: Number(limit)
    })

    ctx.body = {
        success: true,
        data: rows,
        count
    }
}

const bits_history = async ctx => {
    const { id } = ctx.request.token;
    const { skip = 0, limit = 20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        return ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Bits_history.findAndCountAll({
        where: { user_id: id },
        attributes: ['bits_history_id', 'date', 'license_type'],
        order: [
            ['date', 'DESC']
        ],
        offset: Number(skip),
        limit: Number(limit),
        include: {
            model: Bit,
            as: "bit",
            attributes: ['bit_id', 'title'],
            include: {
                model: Bitmaker,
                as: "author_Bitmaker",
                attributes: { exclude: ['photo'] },
                include: {
                    model: Image,
                    as: "photo_image",
                    attributes: { exclude: ['image_id', 'path'] }
                }
            }
        },
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

    const user = await User.findByPk(id, { attributes: { exclude: ['vk_id', 'role', 'password', 'photo'] } });
    if (!user) {
        return ctx.throw(404, "Пользователь не найден");
    }

    user.name = newName;
    await user.save();

    ctx.body = {
        success: true,
        data: user
    }
}


const changePhoto = async ctx => {
    const { id } = ctx.request.token;

    const user = await User.findByPk(id,
    { 
        include: { model: Image, as: "photo_image" },
        attributes: { exclude: ['vk_id', 'role', 'password', 'photo'] }
    });

    if (!user) {
        return ctx.throw(404, "Пользователь не найден");
    }

    if (user.photo_image) {
        if (fs.existsSync(user.photo_image.path)) {
            fs.unlinkSync(user.photo_image.path);
        }

        await user.photo_image.destroy();
        user.photo = null;
    }

    const { files } = await parseFormData(ctx, 'images');

    const newAvatar = await Image.create({
        title: files[0].name,
        path: files[0].path,
        link: files[0].link
    });

    user.photo = newAvatar.image_id;
    await user.save();

    ctx.body = { success: true, photo: newAvatar.link }
}

module.exports = {
    profile,
    replenishment_history,
    bits_history,
    changeName,
    changePhoto
}