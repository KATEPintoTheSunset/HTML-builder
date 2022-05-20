const { mkdir, copyFile, readdir, rm, access } = require("fs/promises");
const { resolve } = require('path');

const originPath = resolve(__dirname, 'files');
const destination = resolve(__dirname, 'files-copy');

const main = async (dest, origin) => {
    
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
                main(resolve(dest, file.name), resolve(origin, file.name));
            }
        }));
    }
}


main(destination, originPath);