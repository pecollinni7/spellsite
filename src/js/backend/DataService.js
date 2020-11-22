const Enums             = require('./Enums');
const StorageService    = require('./StorageService');
const DataServiceEvents = require('./DataServiceEvents');
const Settings          = require('./Settings');

class DataService
{
    constructor() { }

    static _dataFile;
    static _patchFile;
    static _currentlyDownloading = [];

    static _selectedItems   = [];
    static _activePageIndex = 0;

    static _filterMode     = false;
    static _filterModeTags = [];

    static get selectedItems() { return this._selectedItems; }
    static set selectedItems(value) { this._selectedItems = value; }
    static get activePageIndex() { return this._activePageIndex; }
    static set activePageIndex(value) { this._activePageIndex = value; }
    static get isSelectionEmpty() { return this.selectedItems.length === 0}

    static get filterMode() { return this._filterMode; }
    static set filterMode(value) { this._filterMode = value; }
    static get filterModeTags() { return this._filterModeTags; }
    static set filterModeTags(value) { this._filterModeTags = value; }

    static get version()
    {
        if (this.dataFile.hasOwnProperty('version'))
        {
            return this.dataFile['version'];
        }

        console.log(this.dataFile['version']);
        return 0;
    }

    static get dataFile()
    {
        if (this._dataFile === undefined) this._dataFile = StorageService.readFile(Settings.path_dataFile);

        return this._dataFile;
    }

    static set dataFile(value)
    {
        this._dataFile = value;
    }

    static get patchFile()
    {
        if (this._patchFile === undefined) this._patchFile = StorageService.readFile(Settings.path_patchFile);

        return this._patchFile;
    }

    static set patchFile(value)
    {
        this._patchFile = value;
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

    static clearPatch()
    {
        this.patchFile = {};
        this.savePatch();
    }

    static saveData()
    {
        StorageService.writeFile(this.dataFile, Settings.path_dataFile);
    }

    static savePatch()
    {
        StorageService.writeFile(this.patchFile, Settings.path_patchFile);
    }

    static reloadData()
    {
        this._dataFile = StorageService.readFile(Settings.path_dataFile);
    }

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

    static setTagsForFileName(name)
    {
    }

    static getFileNames(tagsFilter = null)
    {
        if (tagsFilter !== null && tagsFilter.length > 0)
        {
            return this.getFilteredNames(tagsFilter);
        }

        return this.getNames();
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
                    if (Settings.fileExists(fileName) && this.isCurrentlyDownloading(fileName) === false)
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
                    if (Settings.fileExists(fileName) && this.isCurrentlyDownloading(fileName) === false)
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

        return res;
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
                    if (Settings.fileExists(fileName))
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

    static getActiveTagsForFileName(fileName)
    {
        let res = [];

        if (this.dataFile.hasOwnProperty(fileName))
        {
            if (this.dataFile[fileName].hasOwnProperty('tags'))
            {
                const tags = this.dataFile[fileName].tags;

                for (const t in tags)
                {
                    if (tags[t] === 1)
                    {
                        res.push(t);
                    }
                }
            }
        }

        return res;
    }

    static updateTag(fileName, tagName, value)
    {
        switch (value)
        {
            case true:
                value = 1;
                break;
            case false:
                value = 0;
                break;
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

    static updateTagsForSelectedItems(tagName, tagValue)
    {
        this.selectedItems.forEach(item => {
            this.updateTag(item.name, tagName, tagValue);
        })
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



    //---------------------------------


    static whatChangedInData(site)
    {
        if (this.getNames().length !== Settings.numOfMediaFiles())
        {
            $(document).trigger(DataServiceEvents.CONTENT_UPDATE);
        }

        if (this.areArraysMatch(site.tagsController.tagsNameList, this.getFileTags()) === false)
        {
            $(document).trigger(DataServiceEvents.TAGS_UPDATE);
        }




    }

    static areArraysMatch(arr1, arr2)
    {
        return arr1.sort().toString() === arr2.sort().toString();
    }

}

module.exports = DataService;