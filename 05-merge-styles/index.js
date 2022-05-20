const { readdir } = require("fs/promises");
const { createReadStream, createWriteStream } = require('fs');
const { resolve } = require('path');
const path = require('node:path');


const main = async () => {
    let bundle = ''
    const files = await readdir(resolve(__dirname, 'styles'), {withFileTypes: true});
    for (let i = 0; i < files.length; i++) {
        let fileName = files[i].name
        if (files[i].isFile() && path.extname(fileName) === ".css") {
            let readStream = createReadStream(resolve(__dirname,'styles', `${fileName}`));
            readStream.on('data', data => {
                bundle += data
                const writeStream = createWriteStream(resolve(__dirname, 'project-dist', 'bundle.css'));
                writeStream.write(bundle + '\r\n');
            });
        };
    }
}

main();
