const StorageController = require('./StorageController');
const FilePaths         = require('./StorageFilePaths');
const fs                = require('fs');

class Data
{
	static _dataFile;
	static _patchFile;

	static get dataFile()
	{
		if (this._dataFile === undefined)
			this._dataFile = StorageController.readFile(FilePaths.path_dataFile);

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
			this._patchFile = StorageController.readFile(FilePaths.path_patchFile);
		}
		return this._patchFile;
	}

	static set patchFile(value)
	{
		this._patchFile = value;
		// StorageController.writeFile(value, FilePaths.path_patchFile);
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
					if (fs.existsSync(FilePaths.path_media + '/' + fileName))
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

		this.dataFile[fileName].tags[tagName] = value;
		this.saveData();
	}

	static saveData()
	{
		StorageController.writeFile(this.dataFile, FilePaths.path_dataFile);
	}

	static savePatch()
	{
		StorageController.writeFile(this.patchFile, FilePaths.path_patchFile);
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
					} else
					{
						console.warn('Missing file: ' + fileName);
					}
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
					if (fs.existsSync(FilePaths.path_media + '/' + fileName))
					{
						const fileTags = this.dataFile[fileName].tags;

						for (const tag in fileTags)
						{
							if (tagsFilterList.indexOf(tag) !== -1)
							{
								if (this.dataFile[fileName].tags[tag] === 1)
								{
									res.push(fileName);
								}
							}
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
