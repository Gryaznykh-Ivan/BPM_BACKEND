const fs = require('fs');
const { parseFormData } = require('./formDataController');
const { Box, Image, Category, License } = require('../models');

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

    ctx.body = {
        success: true
    }
}

const changeLicenseProbability = async ctx => {
    const { id } = ctx.params;
    const { license_id, probability } = ctx.request.body;

    const result = await License.update({ probability }, { where: { case_id: id, license_id  } });

    ctx.body = {
        success: !!result[0]
    }
}

const removeLicense = async ctx => {
    const { id } = ctx.params;
    const { license_id } = ctx.request.body;

    const result = await License.destroy({ where: { license_id, case_id: id } });

    ctx.body = { success: !!result }
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
    remove
}