const { createWriteStream } = require('fs');
const { resolve } = require('path');

const welcomeMessage = 'Welcome';
const endMessage = 'Bye';

const input = process.stdin;
const writeStream = createWriteStream(resolve(__dirname, 'text.txt'));

console.log(welcomeMessage);
input.setEncoding('utf-8');
input.resume();

input.on('data', data => { 
    if(data.toString() === 'exit\r\n' || data.toString() === 'exit\n'){
        exitMessage();
    }
    writeStream.write(data);
});

process.on('SIGINT', exitMessage);


function exitMessage(){
    console.log(endMessage);
    process.exit();
}