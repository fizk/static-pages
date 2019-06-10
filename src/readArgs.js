const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const sections = [
    {
        header: 'Markdown/HTML converter',
        content: 'Converts directory content of markdown files into html.\n01.[name].md will become index.html'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'input',
                alias: 'i',
                typeLabel: '{underline directory}',
                description: 'Path to Mardown files.'
            },
            {
                name: 'output',
                alias: 'o',
                typeLabel: '{underline directory}',
                description: 'Path to output directory.'
            },
            {
                name: 'template',
                alias: 't',
                typeLabel: '{underline file}',
                description: 'Path to template html file.'
            },
            {
                name: 'help',
                alias: 'h',
                description: 'This help screen.'
            }
        ]
    }
];
const usage = commandLineUsage(sections);


const optionDefinitions = [
    { name: 'input', alias: 'i', type: String },
    { name: 'output', alias: 'o', type: String },
    { name: 'template', alias: 't', type: String },
    { name: 'help', alias: 'h', type: Boolean, defaultOption: false },
];
const options = commandLineArgs(optionDefinitions);

module.exports = () => new Promise((resolve, reject) => {

    if (!options.input || !options.output || !options.template) {
        reject({
            message: 'Arguments missing' + usage
        })
    }

    resolve({
        input: path.resolve(options.input),
        output: path.resolve(options.output),
        template: path.resolve(options.template),
        help: options.help,
        usage: usage
    })

});
