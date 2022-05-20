const { readdir, mkdir, rm, access, copyFile, readFile } = require("fs/promises");
const { createReadStream, createWriteStream } = require('fs');
const { resolve } = require('path');
const path = require('node:path');

mkdir(resolve(__dirname, 'project-dist'), { recursive: true });

const merge = async () => {
    //merge css
    let bundle = ''
    const files = await readdir(resolve(__dirname, 'styles'), {withFileTypes: true});
    for (let i = 0; i < files.length; i++) {
        let fileName = files[i].name
        if (files[i].isFile() && path.extname(fileName) === ".css") {
            let readStream = createReadStream(resolve(__dirname,'styles', `${fileName}`));
            readStream.on('data', data => {
                bundle += data
                const writeStream = createWriteStream(resolve(__dirname, 'project-dist', 'style.css'));
                writeStream.write(bundle + '\r\n');
            });
        };
    }
}

const originPath = resolve(__dirname, 'assets');
const destination = resolve(__dirname, 'project-dist', 'assets');

const copy = async (dest, origin) => {
    //copy file
    try {
        await access(dest);  
        await rm(dest, { recursive: true });
    } catch (error) {
        
    } finally {

        mkdir(dest, { recursive: true });
        const files = await readdir(origin, { withFileTypes: true });
    
        await Promise.all(files.map(file => {
            if(file.isFile()){
                return copyFile(resolve(origin, file.name), resolve(dest, file.name));
            } else {
                copy(resolve(dest, file.name), resolve(origin, file.name));
            }
        }));
    }
}

const replaceHtml = async () => {
    let html = await readFile(resolve(__dirname, 'template.html'), { encoding: 'utf-8'});

    const interpolationFiles = html.match(/\{{2}\w+\}{2}/g);

    let fileCounter = 0;

    while(fileCounter < interpolationFiles.length){
        const file = await readFile(resolve(__dirname, 'components', `${interpolationFiles[fileCounter].slice(2, -2)}.html`));
        html = html.replace(interpolationFiles[fileCounter], file);
        fileCounter++;
    }

    const writeStream = createWriteStream(resolve(__dirname, 'project-dist', 'index.html'));
    writeStream.write(html);
}

merge();
copy(destination, originPath);
replaceHtml();