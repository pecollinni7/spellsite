const settings = require('./Settings');
const fs       = require('fs');
const path     = require('path');

function readFile(filePath)
{
    // return JSON.parse(fs.readFileSync(filePath));
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFile(fileData, filePath)
{
    fs.writeFileSync(
        filePath,
        JSON.stringify(fileData, null, 4),
        {encoding: 'utf8'}
    );
}

function deleteFile(fileName)
{
    try {
        console.log('deleting file: ' + fileName);
        fs.unlinkSync(settings.getMediaPathForFileName(fileName));
    }
    catch (err) {
        console.error(err)
    }
}

module.exports = {
    readFile,
    writeFile,
    deleteFile
}