module.exports.name = (name) => name.match(/^([0-9]*\.)(.*)/)[2].replace('.md', '');

module.exports.title = (name) => {
    const nameParts = name.match(/([0-9]*\.)?(.*)(\.[a-zA-Z]{1,3})/);
    return nameParts.length > 1 ? nameParts[2] : '';
};

module.exports.url = (name) => {
    return (parseInt(name.match(/^([0-9]*)/)[1]) === 1)
        ? 'index.html'
        :`${stripIndexer(name).replace(new RegExp(' ', 'g'), '_').toLowerCase().replace('.md', '.html')}`
};

const stripIndexer = (name) => {
    const nameParts = name.match(/([0-9]*\.)?(.*)/);
    return nameParts.length >= 1 ? nameParts[2] : '';
};
