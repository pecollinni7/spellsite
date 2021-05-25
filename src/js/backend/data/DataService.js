const StorageService    = require('./StorageService');
const DataServiceEvents = require('./DataServiceEvents');
const Settings          = require('../Settings');
const Data              = require('./Data');

class DataService
{
    constructor() { }

    static _dataFile;
    static _patchFile;
    static _dlItems;
    static _currentlyDownloading = [];

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

    static get dlItems()
    {
        if (this._dlItems === undefined)
            this._dlItems = StorageService.readFile(Settings.path_dlItemsFile);

        return this._dlItems;
    }

    static set dlItems(value)
    {
        this._dlItems = value;
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

    static saveDlItems()
    {
        StorageService.writeFile(this.dlItems, Settings.path_dlItemsFile);
    }

    static reloadData()
    {
        this._dataFile = StorageService.readFile(Settings.path_dataFile);
    }

    static addToCurrentlyDownloading(fileName)
    {
        if (this.isCurrentlyDownloading(fileName) === false)
            this.dlItems['filesCurrentlyDownloading'].push(fileName);

        this.saveDlItems();

        // if (this.isCurrentlyDownloading(fileName) === false)
        //     this._currentlyDownloading.push(fileName);
    }

    static removeFromCurrentlyDownloading(fileName)
    {
        // StorageService.moveFile(Settings.getTempMediaPathForFileName(fileName), Settings.getMediaPathForFileName(fileName), () => {

            if (this.dlItems.hasOwnProperty('filesCurrentlyDownloading'))
            {
                const itemIndex = this.dlItems['filesCurrentlyDownloading'].indexOf(fileName);
                if (itemIndex > -1)
                    this.dlItems['filesCurrentlyDownloading'].splice(itemIndex, 1);

                this.saveDlItems();
            }
        // });

        // const index = this._currentlyDownloading.indexOf(fileName);
        // if (index > -1)
        // {
        //     this._currentlyDownloading.splice(index, 1);
        // }
    }

    static isCurrentlyDownloading(fileName)
    {
        return this.dlItems['filesCurrentlyDownloading'].indexOf(fileName) > -1;

        // return this._currentlyDownloading.indexOf(fileName) > -1;
    }

    static deleteUndownloadedFiles()
    {
        if (this.dlItems.hasOwnProperty('filesCurrentlyDownloading'))
        {
            for (let i = this.dlItems['filesCurrentlyDownloading'].length - 1; i >= 0; i--)
            {
                const fileName = this.dlItems['filesCurrentlyDownloading'][i];

                if (Settings.fileExists(this.dlItems['filesCurrentlyDownloading'][i]))
                {
                    StorageService.deleteFile(fileName);
                    this.removeFromCurrentlyDownloading(fileName);
                }
            }
        }


    }

    static setTagsForFileName(name)
    {
        console.log('emptyFunction');
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

        $(document).trigger('notifyServer');

    }

    static removeTag(tagName)
    {
        if (this.tagsList.indexOf(tagName) === -1)
        {
            return;
        }

        for (let i = this.tagsList.length - 1; i >= 0; i--)
        {
            if (this.tagsList[i] === tagName)
            {
                this.tagsList.splice(i, 1);
                break;
            }
        }

        this.removeTagPatch(tagName);

        this.saveData();
        this.savePatch();

        $(document).trigger('notifyServer');

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
                StorageService.deleteFile(itemName);
            }
        }

        this.saveData();
        this.savePatch();

        $(document).trigger('notifyServer');
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
        Data.selectedItemNames.forEach(itemName => {
            this.updateTag(itemName, tagName, tagValue);
        });

        $(document).trigger('notifyServer');
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