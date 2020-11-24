const PaginationController = require('./PaginationController');
const Item                 = require('./Item');
const DataService          = require('../data/DataService');
const Data                 = require('../data/Data');
const Settings             = require('../Settings');

class ContentController
{
    _paginationController;
    _items = [];
    _pages = [];

    _fileNames = [];

    get fileNames() { return this._fileNames; }
    set fileNames(value) { this._fileNames = value; }
    get paginationController() { return this._paginationController; }
    set paginationController(value) { this._paginationController = value; }
    get items() { return this._items; }
    set items(value) { this._items = value; }
    get pages() { return this._pages; }
    set pages(value) { this._pages = value; }
    get numOfItems() { return this.items.length; }
    get numOfPages() { return this.pages.length; }
    set activePage(value) {this.pages[Data.currentPageIndex] = value;} //TODO: you could move this to some static class. same for selected items.
    get activePage() { return this.pages[Data.currentPageIndex]; }

    constructor()
    {
        this.paginationController = new PaginationController();
    }

    /*
     * TODO: well dont always generate completely new items.
     *  check if item already exists, and if dont, then create it and push it.
     */

    generate()
    {
        this.items = [];

        this.generateItems();
        this.generatePages();

        this.deployPage(0);
    }

    regenerate()
    {
        if (this.regenerateItems() === true)
        {
            this.generatePages();
            this.deployPage(Data.currentPageIndex, false);
        }
    }

    regenerateItems()
    {
        let newFileNames      = [];
        let itemNamesToAdd    = [];
        let itemNamesToRemove = [];

        if (Data.filterMode)
        {
            newFileNames = DataService.getFileNames(Data.filterModeTags);
        }
        else
        {
            newFileNames = DataService.getFileNames();
        }

        if (this.fileNames.length === newFileNames.length && this.fileNames.toString() === newFileNames.toString())
        {
            // arrays are the same
            // console.log('Arrays are the same. old content and new content items are the same - no change.');
            return false;
        }
        else
        {
            //items to remove
            for (let i = 0; i < this.fileNames.length; i++)
            {
                if (newFileNames.includes(this.fileNames[i]) === false)
                {
                    itemNamesToRemove.push(this.fileNames[i]);
                }

            }

            //items to add
            for (let i = 0; i < newFileNames.length; i++)
            {
                if (this.items.find(item => item.name === newFileNames[i]) === undefined)
                {
                    itemNamesToAdd.push(newFileNames[i]);
                }
            }

            this.removeItems(itemNamesToRemove);
            this.addItems(itemNamesToAdd);

            // console.log('Content items regenerate:\nremoved: ' + itemNamesToRemove + '\nadded: ' + itemNamesToAdd);
        }

        this.fileNames = newFileNames;

        return true;
    }

    generateItems()
    {
        let fileNames;

        if (Data.filterMode)
        {
            fileNames = DataService.getFileNames(Data.filterModeTags);
        }
        else
        {
            fileNames = DataService.getFileNames();
        }

        for (let i = 0; i < fileNames.length; i++)
        {

            // for (let j = 0; j < this.items.length; j++) {
            //     if (this.items[j].name === fileNames[i]) {
            //         break;
            //     }
            // }

            this.addItem(fileNames[i]);
        }

        this.fileNames = fileNames;
    }

    generatePagination()
    {
        this.paginationController.generate(this.numOfPages);
    }

    addItems(itemNames = [])
    {
        itemNames.forEach(item => this.addItem(item));
    }

    addItem(itemName)
    {
        this.items.push(new Item(itemName));
    }

    removeItems(itemNames = [])
    {
        itemNames.forEach(itemName => {
            const index = Data.selectedItemNames.indexOf(itemName);

            if (index > -1)
                Data.selectedItemNames.splice(index, 1);
        });

        for (let i = this.items.length - 1; i >= 0; i--)
        {
            for (let j = 0; j < itemNames.length; j++)
            {
                if (this.items[i].name === itemNames[j])
                {
                    this.items.splice(i, 1);
                }
            }
        }
    }

    deleteSelectedItems()
    {
        const selectedItemNames = this.getSelectedItemNames();
        this.removeItems(selectedItemNames);
        this.generatePages();
        this.deployPage(Data.currentPageIndex, false);

        DataService.removeItems(selectedItemNames);
    }

    deployPage(pageNum, transition = true)
    {
        if (pageNum === undefined)
        {
            console.error('pageNum is undefined');
            return;
        }

        let num = parseInt(pageNum);

        if (num >= this.pages.length) num = this.pages.length - 1;

        if (num < 0) num = 0;

        this.generateHtml(num, transition);
        this.paginationController.setActivePage(num);
    }

    generateHtml(pageNum, transition = true)
    {
        const contentSelector = $('#content');

        if (transition)
            contentSelector.hide();

        contentSelector.html(this.pages[pageNum] + '');

        if (transition)
            contentSelector.fadeIn(Settings.app_transitionDuration);

        this.reselectItems();
    }

    reselectItems()
    {
        this.getSelectedItems().forEach(item => {
            item.select(true);
        })
    }

    pageContainsItem(itemName)
    {
        for (let i = 0; i < this.activePage.length; i++)
            if (this.activePage[i].name === itemName)
                return true;

        return false;
    }

    getSelectedItemsActiveTags()
    {
        let res             = [];
        const selectedItems = this.getSelectedItems();

        selectedItems.forEach(item => {
            const selectedItemActiveTags = item.getActiveTags();

            selectedItemActiveTags.forEach(tagName => {
                if (res.includes(tagName) === false)
                {
                    res.push(tagName);
                }
            });

            // for (const tag in selectedItem.tags)
            // {
            // 	if (selectedItem.tags[tag] === 1)
            // 	{
            // 		res.push(tag);
            // 	}
            // }
        });

        return res;
    }

    getSelectedItems()
    {
        /*
         let res = [];

         this.items.forEach(item => {
         if (item.isSelected)
         {
         res.push(item);
         }
         });

         return res;
         */

        return this.items.filter(item => item.isSelected === true);
    }

    getSelectedItemNames()
    {
        const selectedItems = this.getSelectedItems();

        let res = [];

        for (let i = 0; i < selectedItems.length; i++)
        {
            res.push(selectedItems[i].name);
        }

        return res;
    }

    toggleItemSelection(jqueryItem)
    {
        $(jqueryItem).toggleClass('selected');

        const item = this.getItemByName($(jqueryItem).attr('data-filename'));
        item.select($(jqueryItem).hasClass('selected'));

        // if ($(jqueryItem).hasClass('selected') === true)
        // {
        //     if (DataService.selectedItems.includes(item) === false)
        //         DataService.selectedItems.push(item);
        // }
        // else
        // {
        //     const selectedItemIndex = DataService.selectedItems.indexOf(item)
        //     if (selectedItemIndex > -1)
        //         DataService.selectedItems.splice(selectedItemIndex, 1);
        // }

        // if (Settings.app_saveSelectionOnPageSwitch === true) //TODO: clear selection on page switch if its false
        //     this.activePage = $('#content').html();
    }

    clearSelection()
    {
        // Data.selectedItemNames.forEach(itemName => {
        //     this.getItemByName(itemName).select(false);
        // });
        /*

         const selectedItems = this.items.filter(item => item.isSelected === true);
         console.log('selected items in this.items: ' + selectedItems);

         for (let i = selectedItems.length-1; i >= 0; i--)
         {
         selectedItems[i].select(false);
         }
         */

        for (let i = 0; i < this.items.length; i++)
        {
            for (let j = Data.selectedItemNames.length - 1; j >= 0; j--)
            {
                if (this.items[i].name === Data.selectedItemNames[j])
                {
                    this.items[i].select(false);
                }
            }
        }

    }

    getItemByName(itemName)
    {
        // let res;
        // const t0 = performance.now();
        // for (let i = 0; i < this.items.length; i++)
        // {
        //     if (this.items[i].name === itemName)
        //     {
        //         res = this.items[i];
        //         break;
        //     }
        // }

        return this.items.find(({name}) => name === itemName);
        // return this.items.find(({name}) => name === Data.selectedItemNames);

        // const t1 = performance.now();
        // console.log("Call to getItemByName took " + (t1 - t0) + " milliseconds.");
        //
        // return res;

    }

    generatePages()
    {
        const previousPagesCount = this.numOfPages;

        this.pages = this.chunk(this.items, Settings.app_pageSize);

        if (this.numOfPages !== previousPagesCount)
            this.generatePagination();
    }

    chunk(arr, len)
    {
        let chunks = [], chunksStringed = [], temp = '', i = 0, n = arr.length;

        while (i < n)
        {
            chunks.push(arr.slice(i, i += len));
        }

        for (let j = 0; j < chunks.length; j++)
        {
            for (let k = 0; k < chunks[j].length; k++)
            {
                temp = temp + chunks[j][k].html + '';
            }

            chunksStringed.push(temp);
            temp = '';
        }

        return chunksStringed;
    }

}

module.exports = ContentController;