const fs = require('fs').promises;
const {url, title} = require('./utils');
const Remarkable = require('remarkable');
const swig  = require('swig');

const md = new Remarkable();

module.exports = (config) => {
    return fs.readdir(config.input).then(files => {
        const menu = files.filter(file => file.match(/\.md$/i)).slice().map(file => {
            return {
                title: title(file),
                filename: url(file),
                path: file
            }
        });
        menu.forEach(async (file) => {
            const content = await fs.open(`${config.input}/${file.path}`, 'r')
                .then(handler => handler.readFile())
                .then(file => file.toString());

            const time = await fs.stat(`${config.input}/${file.path}`)
                .then(stats => ({modified: stats.mtime, created: stats.ctime}));

            await fs.writeFile(
                `${config.output}/${file.filename}`,
                swig.renderFile(config.template, {
                    content: md.render(content),
                    menu: menu,
                    file,
                    time,
                })
            ).then(() => console.log(new Date().toISOString(), ' | ', file.filename));
        })
    });
};
