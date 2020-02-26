class Data
{
	_dataFile;

	constructor() {}


	get dataFile()
	{
		return this._dataFile;
	}

	getFileNames (tagsFilter)
	{
		//get only fileNames with these tags
		if (tagsFilter !== undefined && tagsFilter.length > 0) {
			return this.getFilteredNames(tagsFilter);
		}

		return this.getNames();
	}

	getNames()
	{
		let res = [];
		for (const key in this._dataFile)
		{
			if (this._dataFile.hasOwnProperty(key))
			{

				if (key !== 'version')
				{
					res.push(key);
				}
			}
		}

		return res;
	}


	getFilteredNames(tagsFilter)
	{
		let res = [];

		for (const key in this.dataFile)
		{
			if (this.dataFile.hasOwnProperty(key))
			{
				if (this.dataFile[key].hasOwnProperty('tags'))
				{
					const tags = this.dataFile[key]['tags'];

					if (tags.some(r => tagsFilter.include(r)))
					{
						res.push(key);
					}
				}
			}
		}

		return res;
	}


	get version ()
	{
		if (this._dataFile.hasOwnProperty('version'))
		{
			return this._dataFile['version'];
		}

		return null;
	}
}

module.exports = Data;