const StorageController = require('./StorageController');
const FilePaths         = require('./StorageFilePaths');
const fs                = require('fs');

class Data
{
	static _dataFile;
	static _patchFile;
	
	static get dataFile()
	{
		return StorageController.readFile(FilePaths.path_dataFile);
		// return this._dataFile;
	}
	
	static set dataFile(value)
	{
		this._dataFile = value;
		StorageController.writeFile(value, FilePaths.path_dataFile);
	}
	
	static get patchFile()
	{
		return StorageController.readFile(FilePaths.path_patchFile);
		// return this._patchFile;
	}
	
	static set patchFile(value)
	{
		this._patchFile = value;
		StorageController.writeFile(value, FilePaths.path_patchFile);
	}
	
	//you need to sort this
	static getFileNames(tagsFilter)
	{
		if (tagsFilter !== undefined && tagsFilter.length > 0)
		{
			return this.getFilteredNames(tagsFilter);
		}
		
		return this.getNames();
	}
	
	static getNames()
	{
		let res = [];
		for (const fileName in this.dataFile)
		{
			if (this.dataFile.hasOwnProperty(fileName))
			{
				if (fileName !== 'version' && fileName !== 'tagTypes')
				{
					if (fs.existsSync(FilePaths.path_media + '/' + fileName))
					{
						res.push(fileName);
					}
					else
					{
						console.warn('Missing file: ' + fileName);
					}
				}
			}
		}
		
		return res;
	}
	
	
	static getFilteredNames(tagsFilter)
	{
		let res = [];
		
		for (const fileName in this.dataFile)
		{
			if (this.dataFile.hasOwnProperty(fileName))
			{
				if (this.dataFile[fileName].hasOwnProperty('tags'))
				{
					if (fs.existsSync(FilePaths.path_media + '/' + fileName))
					{
						const tags = this.dataFile[fileName]['tagsList'];
						
						if (tags.some(r => tagsFilter.include(r)))
						{
							res.push(fileName);
						}
					}
					else
					{
						console.warn('Missing file: ' + fileName);
					}
				}
			}
		}
		
		return res;
	}
	
	static get tagsList()
	{
		if (this.dataFile.hasOwnProperty('tagTypes'))
		{
			return this.dataFile.tagTypes;
		}
		
		console.error('No tagTypes in the dataFile!');
		return [];
	}
	
	static get version()
	{
		if (this.dataFile.hasOwnProperty('version'))
		{
			return this.dataFile['version'];
		}
		
		return null;
	}
}

module.exports = Data;
