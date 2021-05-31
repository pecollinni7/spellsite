const settings       = require('../Settings');
const fs             = require('fs');
const path           = require('path');
const moveFileModule = require('move-file');

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
    try
    {
        console.log('deleting file: ' + fileName);
        fs.unlinkSync(settings.getMediaPathForFileName(fileName));
    }
    catch (err)
    {
        console.error(err)
    }
}

function moveFile(srcPath, destinationPath, cb)
{
    (async () => {
        await moveFileModule(srcPath, destinationPath, {overwrite: true}).then(() => {cb();});
    })();
}

module.exports = {
    readFile,
    writeFile,
    deleteFile,
    moveFile
};