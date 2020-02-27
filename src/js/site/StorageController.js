const StorageFilePaths = require('./StorageFilePaths');
const fs               = require('fs');

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
			JSON.stringify(fileData, null, 2),
			{encoding: 'utf8'});
		
		// console.timeEnd('writeFile');
	}
}

module.exports = StorageController;
