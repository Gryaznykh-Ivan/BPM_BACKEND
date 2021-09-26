const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const pathToLink = (path) => {
    do {
        path = path.replace('\\', '/')
    } while (path.indexOf('\\') != -1)

    return path.replace(process.env.APP_ROOT_FOLDER, '');
}

const parseFormData = (ctx, folder) => (
    new Promise((resolve, reject) => {
        const form = new formidable({ keepExtensions: true });

        form.on('fileBegin', (formName, file) => {
            const name = [uuid(), file.name.split('.')[1]].join('.');
            const randomPath = path.join(__dirname, '../../static', folder, Math.floor(Math.random() * 100).toString(16).padStart(2, '0'));
            const fullPath = path.join(randomPath, name);

            if (!fs.existsSync(randomPath)) fs.mkdirSync(randomPath, { recursive: true });
            file.name = name;
            file.path = fullPath;
            file.link = pathToLink(fullPath)
        });

        form.parse(ctx.req, (err, fields, files) => {
            if (err) return reject(err);

            resolve({ fields, files: Object.values(files) });
        });
    })
)



module.exports = {
    parseFormData
}