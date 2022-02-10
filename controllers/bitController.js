const fs = require('fs');
const send = require('koa-send');
const { parseFormData } = require('./formDataController');
const { Op } = require('../db');
const { Bit, File, Bitmaker, Image, Bits_history } = require('../models');

const download = async ctx => {
    const { id: userId } = ctx.request.token;
    const { bit_id, license_type } = ctx.request.query;

    const history = await Bits_history.findOne({ where: { bit_id, license_type, user_id: userId }});
    if (!history) {
        ctx.throw(403, "У вас нет прав на эту композицию");
    }

    const file = await File.findOne({ where: { bit_id, license_type }});
    if (!file) {
        ctx.throw(404, "Файл не был загружен на сервер. Обратитесь в тех поддержку.");
    }
    
    if (!fs.existsSync(file.path)) {
        ctx.throw(404, "Файл удален или поврежден. Обратитесь в тех поддержку");
    }

    await send(ctx, file.path, { root: '/' });
}

const getList = async ctx => {
    const { skip = 0, limit = 20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Bit.findAndCountAll({
        order: [
            ['bit_id', 'DESC']
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

const getByName = async ctx => {
    const { q, skip = 0, limit = 20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Bit.findAndCountAll({
        where: { title: { [Op.like]: `%${q}%` } },
        order: [
            ['bit_id', 'DESC']
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

const get = async ctx => {
    const { id } = ctx.params;

    const bit = await Bit.findByPk(id, {
        include: [
            {
                model: File,
                as: "files",
            },
            {
                model: Bitmaker,
                as: "author_Bitmaker",
                include: {
                    model: Image,
                    as: "photo_image"
                }
            },
            {
                model: Image,
                as: "photo_image"
            }
        ]
    });

    if (!bit) {
        ctx.throw(404, "Бит не найден");
    }

    ctx.body = {
        success: true,
        data: bit
    }
}

const create = async ctx => {
    const data = ctx.request.body;

    if (!data.title) {
        ctx.throw(400, "title обязательный параметр");
    }

    const bit = await Bit.create(data);

    ctx.status = 201;
    ctx.body = { success: true, data: bit }
}

const update = async ctx => {
    const { id } = ctx.params;
    const data = ctx.request.body;

    const result = await Bit.update(data, { where: { bit_id: id } });

    ctx.body = {
        success: !!result[0]
    }
}

const changePhoto = async ctx => {
    const { id } = ctx.params;
    const { files } = await parseFormData(ctx, 'images');

    const bit = await Bit.findByPk(id, {
        include: {
            model: Image,
            as: "photo_image"
        }
    });

    if (!bit) {
        ctx.throw(400, "bit не найден");
    }

    if (bit.photo_image) {
        if (fs.existsSync(bit.photo_image.path)) {
            fs.unlinkSync(bit.photo_image.path);
        }

        await bit.photo_image.destroy();
        bit.photo = null;
    }

    const newPhoto = await Image.create({
        title: files[0].name,
        path: files[0].path,
        link: files[0].link
    });

    bit.photo = newPhoto.image_id;
    await bit.save();

    ctx.body = { success: true, photo: newPhoto.link }
}

const addFile = async ctx => {
    const { id } = ctx.params;
    const { files, fields: { license_type } } = await parseFormData(ctx, 'files');

    const file = await File.create({
        license_type,
        path: files[0].path,
        bit_id: id
    });

    ctx.status = 201;
    ctx.body = {
        success: true,
        data: file
    }
}

const updateFile = async ctx => {
    const { file_id } = ctx.params;
    const data = ctx.request.body;

    const result = await File.update(data, { where: { file_id } });

    ctx.body = {
        success: !!result[0]
    }
}

const removeFile = async ctx => {
    const { file_id } = ctx.params;

    const file = await File.findByPk(file_id);
    if (!file) {
        ctx.trhow(404, "File не найден");
    }

    if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }

    const result = await file.destroy();

    ctx.body = { success: !!result }
}

const remove = async ctx => {
    const { id } = ctx.params;

    const result = await Bit.destroy({ where: { bit_id: id } });

    ctx.body = { success: !!result }
}


module.exports = {
    download,
    getList,
    getByName,
    get,
    create,
    update,
    addFile,
    updateFile,
    removeFile,
    changePhoto,
    remove
}