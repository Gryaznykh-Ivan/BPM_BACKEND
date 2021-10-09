const { Bitmaker } = require('../models')


const getList = async ctx => {
    const { skip=0, limit=20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Bitmaker.findAndCountAll({
        offset: skip,
        limit,
        order: [
            ['bitmaker_id', 'DESC']
        ]
    })

    ctx.body = {
        success: true,
        data: rows,
        count
    }
}


const create = async ctx => {
    const { name } = ctx.request.body;

    if (!name) return ctx.throw(400, "name не передан")

    const bitmaker = await Bitmaker.create({ name });
    if (!bitmaker) return ctx.throw(400, "Ошибка при создании bitmaker")

    ctx.status = 201;
    ctx.body = { success: true, data: bitmaker }
}

const changePhoto = async ctx => {
    const { id } = ctx.params;
    const { files } = await parseFormData(ctx, 'images');

    const bitmaker = await Bitmaker.findByPk(id, {
        include: {
            model: Image,
            as: "photo_image"
        }
    });

    if (!bitmaker) {
        ctx.throw(400, "bitmaker не найден");
    }

    if (bitmaker.photo_image) {
        if (fs.existsSync(bitmaker.photo_image.path)) {
            fs.unlinkSync(bitmaker.photo_image.path);
        }

        await bitmaker.photo_image.destroy();
        bitmaker.photo = null;
    }

    const newPhoto = await Image.create({
        title: files[0].name,
        path: files[0].path,
        link: files[0].link
    });

    bitmaker.photo = newPhoto.image_id;
    await bitmaker.save();

    ctx.body = { success: true, photo: newPhoto.link }
}

const update = async ctx => {
    const { id } = ctx.params;
    const data = ctx.request.body;

    const result = await Bitmaker.update(data, { where: { bitmaker_id: id } });

    ctx.body = { success: !!result[0] }
}

const remove = async ctx => {
    const { id } = ctx.params;

    const result = await Bitmaker.destroy({ where: { bitmaker_id: id } });

    ctx.body = { success: !!result }
}

module.exports = {
    getList,
    create,
    changePhoto,
    update,
    remove
}