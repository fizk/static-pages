const readArgs = require('./readArgs');
const convert = require('./convert');

readArgs()
    .then(config => {
        if (config.help) {
            console.log(config.usage);
            process.exit(0)
        }

        return config
    })
    .then(convert)
    .catch(error => {
        console.error(error.message);
        process.exit(1)
    });
