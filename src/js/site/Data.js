const StorageController = require('./StorageController');
const Settings          = require('./Settings');
const path              = require('path');
const fs                = require('fs');

class Data
{
	static _dataFile;
	static _patchFile;
	static _currentlyDownloading = [];

	static addToCurrentlyDownloading(fileName)
	{
		if (this.isCurrentlyDownloading(fileName) === false)
		{
			this._currentlyDownloading.push(fileName);
		}
	}

	static removeFromCurrentlyDownloading(fileName)
	{
		const index = this._currentlyDownloading.indexOf(fileName);
		if (index > -1)
		{
			this._currentlyDownloading.splice(index, 1);
		}
	}

	static isCurrentlyDownloading(fileName)
	{
		return this._currentlyDownloading.indexOf(fileName) !== -1;
	}




	static get dataFile()
	{
		if (this._dataFile === undefined)
			this.reloadData();

		return this._dataFile;
	}

	static set dataFile(value)
	{
		this._dataFile = value;
		// StorageController.writeFile(value, FilePaths.path_dataFile);
	}

	static get patchFile()
	{
		if (this._patchFile === undefined)
		{
			this._patchFile = StorageController.readFile(Settings.getSettings('path.patch'));
		}
		return this._patchFile;
	}

	static set patchFile(value)
	{
		this._patchFile = value;
		// StorageController.writeFile(value, FilePaths.path_patchFile);
	}
	
	static reloadData()
	{
		this._dataFile = StorageController.readFile(Settings.getSettings('path.data'));
	}
	
	static clearPatch()
	{
		this.patchFile = {};
		this.savePatch();
		// fs.writeFileSync(path_patchFile, JSON.stringify({}), 'utf8');
	}
	
	static saveData()
	{
		StorageController.writeFile(this.dataFile, Settings.getSettings('path.data'));
	}
	
	static savePatch()
	{
		StorageController.writeFile(this.patchFile, Settings.getSettings('path.patch'));
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

	static getFileTags()
	{
		let res = {};

		for (const fileName in this.dataFile)
		{
			if (this.dataFile.hasOwnProperty(fileName))
			{
				if (fileName !== 'version' && fileName !== 'tagTypes')
				{
					if (fs.existsSync(Settings.getSettings('path.media') + '/' + fileName))
					{
						if (this.dataFile[fileName].hasOwnProperty('tags'))
						{
							res[fileName]         = {};
							res[fileName]['tags'] = {};
							res[fileName]['tags'] = this.dataFile[fileName].tags;

							// res.push({fileName: this.dataFile[fileName].tags});
						}
					}
				}
			}
		}

		return res;
	}


	static getTagsForFileName(fileName)
	{
		if (this.dataFile.hasOwnProperty(fileName))
		{
			if (this.dataFile[fileName].hasOwnProperty('tags'))
			{
				return this.dataFile[fileName].tags;
			}
		}
	}

	static setTagsForFileName(fileName, newTags)
	{
		if (this.dataFile.hasOwnProperty(fileName) === false)
		{
			this.dataFile[fileName] = {};
		}

		if (this.dataFile[fileName].hasOwnProperty('tags') === false)
		{
			this.dataFile[fileName]['tags'] = {};
		}

		this.dataFile[fileName].tags = newTags;
	}


	static updateTag(fileName, tagName, value)
	{
		switch (value)
		{
			case true: 	value = 1; break;
			case false: value = 0; break;
		}
		
		if (this.dataFile.hasOwnProperty(fileName) === false) this.dataFile[fileName] = {};
		if (this.dataFile[fileName].hasOwnProperty('tags') === false) this.dataFile[fileName].tags = {};
		if (this.patchFile.hasOwnProperty(fileName) === false) this.patchFile[fileName] = {};
		if (this.patchFile[fileName].hasOwnProperty('tags') === false) this.patchFile[fileName].tags = {};
		
		this.dataFile[fileName].tags[tagName]  = value;
		this.patchFile[fileName].tags[tagName] = value;
		this.saveData();
		this.savePatch();
	}


	

	static getAllFileNamesNoExistCheck()
	{
		let res = [];
		for (const fileName in this.dataFile)
		{
			if (this.dataFile.hasOwnProperty(fileName))
			{
				if (fileName !== 'version' && fileName !== 'tagTypes')
				{
					res.push(fileName);
				}
			}
		}

		return res;
	}


	static getFilteredNames(tagsFilterList)
	{
		let res = [];

		for (const fileName in this.dataFile)
		{
			if (this.dataFile.hasOwnProperty(fileName))
			{
				if (this.dataFile[fileName].hasOwnProperty('tags'))
				{
					if (fs.existsSync(Settings.getSettings('path.media') + '/' + fileName) && this.isCurrentlyDownloading(fileName) === false)
					{
						const fileTags = this.dataFile[fileName].tags;

						for (const tag in fileTags)
						{
							if (tagsFilterList.indexOf(tag) !== -1)
							{
								if (this.dataFile[fileName].tags[tag] === 1)
								{
									if (res.includes(fileName) === false)
									{
										res.push(fileName);
									}
								}
							}
						}
					}
					else
					{
						// console.warn('Missing file: ' + fileName);
					}
				}
			}
		}
		
		res.sort((a, b) => (this.dataFile[b].date - this.dataFile[a].date));
		
		// console.log(res);

		return res;
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
					if (fs.existsSync(Settings.getSettings('path.media') + '/' + fileName) && this.isCurrentlyDownloading(fileName) === false)
					{
						res.push(fileName);
					}
					else
					{
						// console.warn('Missing file: ' + fileName);
					}
				}
			}
		}
		
		res.sort((a, b) => (this.dataFile[b].date - this.dataFile[a].date));
		
		// console.log(res);
		return res;
	}

	static removeTagPatch(tagName)
	{
		if (this.patchFile.hasOwnProperty('removeTags') === false)
		{
			this.patchFile['removeTags'] = [];
		}

		if (this.patchFile['removeTags'].indexOf(tagName) === -1)
		{
			this.patchFile['removeTags'].push(tagName);
		}
	}

	static removeItemPatch(itemName)
	{
		if (this.patchFile.hasOwnProperty('removeItems') === false)
		{
			this.patchFile['removeItems'] = [];
		}

		if (this.patchFile['removeItems'].indexOf(itemName) === -1)
		{
			this.patchFile['removeItems'].push(itemName);
		}

	}

	static removeTag(tagName)
	{
		const tags = this.tagsList;

		if (tags.indexOf(tagName) === -1)
		{
			return;
		}

		for (let i = tags.length-1; i >= 0; i--)
		{
			if (tags[i] === tagName)
			{
				tags.splice(i, 1);
				break;
			}
		}

		this.removeTagPatch(tagName);

		this.saveData();
		this.savePatch();
	}

	static removeItems(itemNames)
	{
		for (let i = 0; i < itemNames.length; i++)
		{
			const itemName = itemNames[i];

			if (this.dataFile.hasOwnProperty(itemName))
			{
				delete this.dataFile[itemName];
				this.removeItemPatch(itemName);
				StorageController.deleteFile(itemName);
			}
		}


		this.saveData();
		this.savePatch();
	}
	
	static addNewTag(tagName)
	{
		if (this.dataFile.hasOwnProperty('tagTypes'))
		{
			if (this.dataFile.tagTypes.indexOf(tagName) !== -1) //so it exits already
			{
				return;
			}

			this.dataFile.tagTypes.push(tagName);
		}

		this.patchFile.tagTypes = this.dataFile.tagTypes;
		
		this.saveData();
		this.savePatch();
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

	static tagsOrderUpdate(tags)
	{
		if (tags === undefined) return;

		this.dataFile.tagTypes = this.patchFile.tagTypes = tags;

		this.saveData();
		this.savePatch();
	}

	static set tagsList(value)
	{
		this.dataFile.tagTypes = value;
	}

	static get version()
	{
		if (this.dataFile.hasOwnProperty('version'))
		{
			return this.dataFile['version'];
		}
		
		console.log(this.dataFile['version']);
		return 0;
	}

	static removeInvalidMediaFiles()
	{
		const invalidFiles = this.getInvalidMediaFiles();

		for (let i = 0; i < invalidFiles.length; i++)
		{
			StorageController.deleteFile(invalidFiles[i]);
		}
	}

	static getInvalidMediaFiles()
	{
		let res = [];
		const fileNames = Data.getNames();

		for (let i=0; i<fileNames.length; i++) {

			if (this.checkIfFileIsValid(fileNames[i]) === false) {
				res.push(fileNames[i]);
			}
		}

		return res;
	}

	static checkIfFileIsValid(fileName)
	{
		const filePath = path.join(Settings.getSettings('path.media'), fileName);

		if (fs.statSync(filePath)['size'] === 0)
		{
			console.error('Corrupted media file: ' + filePath);
			return false;
		}
		return true;
	}

}

module.exports = Data;
