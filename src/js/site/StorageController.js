const StorageFilePaths = require('./StorageFilePaths');
const fs               = require('fs');
const path             = require('path');

class StorageController
{


	static readFile(filePath)
	{
		return JSON.parse(fs.readFileSync(filePath));
	}

	static writeFile(fileData, filePath)
	{
		// console.time('writeFile');

		fs.writeFileSync(
			filePath,
			// fileData,
			JSON.stringify(fileData, null, 4),
			{encoding: 'utf8'});

		// console.timeEnd('writeFile');
	}

	static deleteFile(fileName)
	{
		try
        {
			console.log('deleting file: ' + fileName);
            fs.unlinkSync(path.join(StorageFilePaths.path_media, fileName));
		}
		catch(err)
        {
			console.error(err)
		}
	}
}

module.exports = StorageController;
