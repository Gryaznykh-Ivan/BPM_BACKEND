const fs = require('fs');
const { parseFormData } = require('./formDataController');
const { Box, Image, Category } = require('../models');

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

const edit = async ctx => {
    const { id, ...rest } = ctx.request.body;

    const result = await Box.update(rest, { where: { case_id: id } });

    console.log(result);

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
    const { files, fields: { id } } = await parseFormData(ctx, 'images');

    if (!id) {
        ctx.throw(400, "id обязательное поле");
    }

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
    const { id } = ctx.request.body;

    const result = await Box.destroy({ where: { case_id: id } });

    ctx.body = { success: !!result }
}

module.exports = {
    getCasesByCategories,
    getList,
    edit,
    create,
    changePhoto,
    remove
}