const fs = require('fs');
const { parse } = require('svg-parser');

function getProperties(obj) {
    let attrs = '';
    if (obj) {
        Object.keys(obj).forEach(key => {
            attrs = attrs + ` ${key}="${obj[key]}"`
        });
    }
    return attrs;
}

function getChild(obj) {
    let childEl = '';
    obj.forEach(el => {
        if (el.children && el.children.length) {
            childEl = childEl + `<${el.tagName}${getProperties(el.properties)}>${getChild(el.children)}</${el.tagName}>`;
        } else {
            childEl = childEl + `<${el.tagName}${getProperties(el.properties)} />`;
        }
    });
    return childEl;
}

// Read from sprite file
fs.readFile('sprites.svg', 'utf8', function (err, contents) {
    const parsed = parse(contents);
    const symbols = parsed.children[0].children;

    symbols.forEach(symbol => {
        const name = symbol.properties.id;

        // Build SVG content
        const newIcon = `<svg${getProperties(symbol.properties)}>
${getChild(symbol.children)}
</svg>`

        // White to file
        fs.writeFile(`icons/${name}.svg`, newIcon, () => {
            console.log(name);
        });
    });
});

//fs.readFile('./src/add-cell.svg', 'utf8', function (err, contents) {
//    console.log(err);
//    const parsed = parse(contents);
//    const svg = parsed.children[0].children;
//    console.log(svg);
//});


//const replace = require('replace-in-file');
//const options = {
//    files: './src/**/*.svg',
//    from: /http:/g,
//    to: 'https:',
//};

//replace(options, (error, results) => {
//    if (error) {
//        return console.error('Error occurred:', error);
//    }
//    console.log('Replacement results:', results);
//});