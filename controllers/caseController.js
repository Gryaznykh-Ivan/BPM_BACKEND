const fs = require('fs');
const { parseFormData } = require('./formDataController');
const { Box, Image, Category, License, License_bit } = require('../models');

const getList = async ctx => {
    const boxs = await Box.findAll({
        attributes: { exclude: ['category_id', 'photo'] },
        include: {
            model: Image,
            as: "photo_image",
            attributes: { exclude: ['image_id', 'path'] }
        }
    });

    ctx.body = {
        success: true,
        data: boxs
    }
}

const getCasesByCategories = async ctx => {
    const boxs = await Category.findAll({
        include: {
            model: Box,
            as: 'boxes',
            attributes: ['case_id', 'title', 'description', 'price', 'price_without_discount'],
            include: {
                model: Image,
                as: "photo_image",
                attributes: { exclude: ['image_id', 'path'] }
            }
        }
    });

    ctx.body = {
        success: true,
        data: boxs
    }
}

const update = async ctx => {
    const { id } = ctx.params;
    const data = ctx.request.body;

    const result = await Box.update(data, { where: { case_id: id } });

    ctx.body = {
        success: !!result[0]
    }
}

const create = async ctx => {
    const { title, price, ...rest } = ctx.request.body;

    if (!title || !price) {
        ctx.throw(400, "title и price обязательные параметры");
    }

    const box = await Box.create({ title, price, ...rest });

    ctx.status = 201;
    ctx.body = { success: true, data: box }
}

const changePhoto = async ctx => {
    const { id } = ctx.params;
    const { files } = await parseFormData(ctx, 'images');

    const box = await Box.findByPk(id, {
        include: {
            model: Image,
            as: "photo_image"
        }
    });

    if (!box) {
        ctx.throw(400, "Кейс не найден");
    }

    if (box.photo_image) {
        if (fs.existsSync(box.photo_image.path)) {
            fs.unlinkSync(box.photo_image.path);
        }

        await box.photo_image.destroy();
        box.photo = null;
    }

    const newPhoto = await Image.create({
        title: files[0].name,
        path: files[0].path,
        link: files[0].link
    });

    box.photo = newPhoto.image_id;
    await box.save();

    ctx.body = { success: true, photo: newPhoto.link }
}

const remove = async ctx => {
    const { id } = ctx.params;

    const result = await Box.destroy({ where: { case_id: id } });

    ctx.body = { success: !!result }
}


const addLicense = async ctx => {
    const { id } = ctx.params;
    const { type, probability } = ctx.request.body;

    const licese = await License.create({ case_id: id, type, probability });
    if (!licese) {
        ctx.throw(400, "Создать лицензию не удалось");
    }

    ctx.status = 201;
    ctx.body = {
        success: true
    }
}

const changeLicenseProbability = async ctx => {
    const { license_id } = ctx.params;
    const { probability } = ctx.request.body;

    const result = await License.update({ probability }, { where: { license_id } });

    ctx.body = {
        success: !!result[0]
    }
}

const removeLicense = async ctx => {
    const { license_id } = ctx.params;

    const result = await License.destroy({ where: { license_id } });

    ctx.body = { success: !!result }
}

const getLicense = async ctx => {
    const { license_id } = ctx.params;
    const { skip = 0, limit = 20 } = ctx.request.query;

    if (limit > 20 || limit < 1 || skip < 0) {
        ctx.throw(400, "Limit должен быть =< 20 и > 0. Skip должен быть > 0.");
    }

    const { count, rows } = await Bit.findAndCountAll({
        offset: skip,
        limit,
        order: [
            ['bit_id', 'DESC']
        ]
    })

    const license = await License.findByPk(license_id, {
        include: {
            model: License_bit,
            as: 'License_bits',
            offset: skip,
            limit,
            order: [
                ['bit_id', 'DESC']
            ]
        }
    })

    if (!license) {
        ctx.throw(404, "Лицензия не найдена");
    }

    ctx.body = {
        success: true,
        data: license
    }
}

const addLicenseBit = async ctx => {
    const { license_id } = ctx.params;
    const { bit_id } = ctx.request.body;

    const license_bit = await License_bit.create({ license_id, bit_id });
    if (!license_bit) ctx.throw(400, "Ошибка при создании license_bit")

    ctx.status = 201;
    ctx.body = { success: true, data: license_bit }
}

const removeLicenseBit = async ctx => {
    const { license_id } = ctx.params;
    const { bit_id } = ctx.request.body;

    const license_bit = await License_bit.destroy({ where: { license_id, bit_id } });

    ctx.body = { success: !!license_bit }
}



module.exports = {
    getCasesByCategories,
    getList,
    addLicense,
    changeLicenseProbability,
    removeLicense,
    update,
    create,
    changePhoto,
    remove,
    getLicense,
    addLicenseBit,
    removeLicenseBit
}