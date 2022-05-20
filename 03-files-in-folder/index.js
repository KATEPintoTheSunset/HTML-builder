const { stat } = require("fs");
const { readdir } = require("fs/promises");
const { resolve } = require('path');
const path = require('node:path');


const main = async () => {
    const files = await readdir(resolve(__dirname, 'secret-folder'), {withFileTypes: true});
    for (let i = 0; i < files.length; i++) {
        if (files[i].isFile()) {
            let fileName = files[i].name;
            let fileType = path.extname(fileName);
            stat(resolve(__dirname, 'secret-folder', fileName), (err, stats) => {
                console.log(fileName.replace(/\.\w+$/, '') + ' - ' + fileType.replace(/^\./, '') + ' - ' + stats.size + 'b')
            });
        }
    }
}

main();


