const fs = require('fs');
const sequelize = require('../db');
const { parseFormData } = require('./formDataController');
const { Box, Box_history, Bits_history, Image, Category, License, License_bit, Bit, User } = require('../models');

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const open = async ctx => {
    const { id } = ctx.params;
    const { id: userId } = ctx.request.token;

    const t = await sequelize.transaction();
    try {
        const box = await Box.findByPk(id, {
            attributes: ['price', 'opened', 'income', 'reopenable_in'],
            include: {
                attributes: ['user_id', 'date'],
                model: Box_history,
                as: 'box_histories',
                where: { user_id: userId },
                order: [['date', 'DESC']],
                limit: 1,
                required: false,
            }
        }, { transaction: t });
    
        if (box.box_histories.length != 0) {
            const last_opened = box.box_histories[0].date;
    
            if (box.reopenable_in > Date.now() - last_opened) {
                ctx.throw(400, "Кейс имеет ограничение на число открытий. Вы уже недавно открывали этот кейс.");
            }
        }
    
        const user = await User.findByPk(userId, { attributes: ['user_id', 'balance'] }, { transaction: t });
        if (!user) {
            return ctx.throw(404, "Пользователь не найден");
        }
    
        if (user.balance < box.price) {
            ctx.throw(400, "На балансе недостаточно средств");
        }
    
        const content = await Box.findByPk(id, {
            attributes: [],
            include: {
                attributes: ['license_id', 'type', 'probability'],
                model: License,
                as: 'Licenses',
                include: {
                    attributes: [],
                    model: Bit,
                    as: 'bits',
                    required: true
                }
            }
        }, { transaction: t });
    
        const probabilities = content.Licenses.reduce((acc, current) => {
            if (acc.length == 0) return [current.probability];
            acc.push(acc[acc.length - 1] + current.probability);
            return acc;
        }, []);
    
        if (probabilities.length == 0) {
            ctx.throw(400, "Кейс временно недоступен, так как все биты раскуплены");
        }
    
        const winNumber = getRandomInt(0, probabilities[probabilities.length - 1] + 1);
        let winIndex = 0;
        probabilities.forEach((number, index) => {
            if (number < winNumber) winIndex = index + 1;
        });
    
        const { type, license_id } = content.Licenses[winIndex];
        const bit = await License_bit.findOne({
            where: { license_id },
            order: sequelize.fn('RAND'),
            include: {
                attributes: ['bit_id', 'title'],
                model: Bit,
                as: 'bit',
                required: true,
                include: {
                    model: Image,
                    as: "photo_image",
                    attributes: { exclude: ['image_id', 'path', 'title'] }
                }
            }
        }, { transaction: t });
    
        if (!bit) {
            ctx.throw(400, "Произошла ошибка. Пожалуйста, обратитесь в поддержку.");
        }
    
        // добавляем историю кейса
        const boxHistory = await Box_history.create({ user_id: userId, case_id: id }, { transaction: t });
        if (!boxHistory) ctx.throw(400, "Ошибка при создании boxHistory")
    
        // добавляем испорию бита
        const bitHistory = await Bits_history.create({ user_id: userId, license_type: type, bit_id: bit.bit_id }, { transaction: t });
        if (!bitHistory) ctx.throw(400, "Ошибка при создании bitHistory")
    
        // добавляем статистику по кейсу
        box.income += box.price;
        box.opened += 1;
        await box.save({ transaction: t });
    
        // если права уникальные - удаляем бит из всех кейсов и пристаиваем belongs
        if (type >= 10) {
            await Bit.update({ belongs: userId }, { where: { bit_id: bit.bit_id }, transaction: t });
            await License_bit.destroy({ where: { license_id: license_id, bit_id: bit.bit_id } }, { transaction: t });
        }
        
        // забераем деньги с баланса и добавляем статистику
        user.balance -= box.price;
        user.cases_opened += 1;
        user.bits_dropped += 1;
        await user.save({ transaction: t });
        
        await t.commit();

        ctx.body = {
            success: true,
            data: {
                bit_id: bit.bit_id,
                title: bit.bit.title,
                photo: bit.bit.photo_image ? bit.bit.photo_image.link : null,
                license_id: bit.license_id,
                license_type: type
            }
        }
    }
    catch (e)
    {
        await t.rollback();
        ctx.throw(400, e.message);
    }
}

const get = async ctx => {
    const { id } = ctx.params;

    const box = await Box.findByPk(id, {
        attributes: { exclude: ['photo'] },
        include: [{
            model: Image,
            as: "photo_image",
            attributes: { exclude: ['image_id', 'path'] }
        },
        {
            model: License,
            as: 'Licenses'
        }]
    })

    if (!box) {
        ctx.throw(404, "Кейс не найден");
    }

    ctx.body = {
        success: true,
        data: box
    }
}

const getCaseContent = async ctx => {
    const { id } = ctx.params;

    const boxContent = await Box.findByPk(id, {
        attributes: [],
        include: {
            attributes: ['type'],
            model: License,
            as: 'Licenses',
            include: {
                attributes: ['title'],
                model: Bit,
                as: 'bits',
                include: {
                    model: Image,
                    as: "photo_image",
                    attributes: { exclude: ['image_id', 'path', 'title'] }
                }
            }
        }
    });

    if (!boxContent.Licenses || boxContent.Licenses.length == 0) {
        ctx.throw(400, "У кейса нет содержимого");
    }

    const result = boxContent.Licenses.reduce((acc, current) => {
        const bits = current.bits.map(bit => ({ title: bit.title, photo: bit.photo_image ? bit.photo_image.link : null, type: current.type }));
        acc.push(...bits);
        return acc;
    }, []);

    ctx.body = {
        success: true,
        data: result
    }
}

const getList = async ctx => {
    const boxs = await Box.findAll({
        attributes: ['case_id', 'title', 'description', 'price', 'price_without_discount'],
        order: [
            ['case_id', 'DESC']
        ],
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

    const license = await License.findByPk(license_id, {
        include: {
            model: Bit,
            as: "bits",
            include: {
                model: Image,
                as: "photo_image",
                attributes: { exclude: ['image_id', 'path'] }
            }
        }
    });
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
    open,
    get,
    getCaseContent,
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