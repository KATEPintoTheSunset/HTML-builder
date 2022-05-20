const { createReadStream } = require('fs');
const { resolve } = require('path');

const readStream = createReadStream(resolve(__dirname, 'text.txt'));

readStream.on('data', chunk => console.log(chunk.toString()));
