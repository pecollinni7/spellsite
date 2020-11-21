const PaginationController = require('./PaginationController');
const Item                 = require('./Item');
const DataService          = require('./DataService');
const Settings             = require('./Settings');

class ContentController
{
    _paginationController;
    _items = [];
    _pages = [];

    get paginationController() { return this._paginationController; }
    set paginationController(value) { this._paginationController = value; }
    get items() { return this._items; }
    set items(value) { this._items = value; }
    get pages() { return this._pages; }
    set pages(value) { this._pages = value; }
    get numOfItems() { return this.items.length; }
    get numOfPages() { return this.pages.length; }
    set activePage(value) {this.pages[DataService.activePageIndex] = value;} //TODO: you could move this to some static class. same for selected items.
    get activePage() { return this.pages[DataService.activePageIndex]; }

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
        this.pages = [];

        this.generateItems();
        this.generatePages();
        this.generatePagination();

        this.deployPage(0);
    }

    generateItems()
    {
        let fileNames;

        if (DataService.filterMode)
        {
            fileNames = DataService.getFileNames(DataService.filterModeTags);
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
    }

    generatePagination()
    {
        this.paginationController.generate(this.numOfPages);
    }

    addItem(itemName)
    {
        this.items.push(new Item(itemName));
    }

    removeItem(itemName)
    {
        for (let i = this.items.length; i > 0; i--)
        {
            if (this.items.name === itemName)
            {
                this.items.slice(i, 1);
            }
        }
    }

    removeItems(itemNames)
    {
        itemNames.forEach(item => {
            this.removeItem(item)
        });
    }

    deployPage(pageNum)
    {

        if (pageNum === undefined)
        {
            console.error('pageNum is undefined');
            return;
        }

        let num = parseInt(pageNum);

        if (num >= this.pages.length) num = this.pages.length - 1;

        if (num < 0) num = 0;

        this.generateHtml(num);

        // if (this.activePage !== undefined)
        //     this.activePage.clearSelection();

        // this.activePageIndex = num;
        // this.deployActivePage();

        this.paginationController.setActivePage(num);



    }

    generateHtml(pageNum)
    {
        let c = $('#content');

        $('#content').hide();

        $('#content').html(this.pages[pageNum] + '');

        DataService.selectedItems.forEach(item => {
            this.getItemByName(item.name).select();
        })

        $('#content').fadeIn(150);
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
        let res = [];

        this.items.forEach(item => {
            if (item.isSelected)
            {
                res.push(item);
            }
        });

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
        //
        // if (Settings.app_saveSelectionOnPageSwitch === true) //TODO: clear selection on page switch if its false
        //     this.activePage = $('#content').html();
    }

    clearSelection()
    {
        for (let i = DataService.selectedItems.length-1; i >= 0; i--)
        {
            DataService.selectedItems[i].select(false);
        }
    }

    getItemByName(itemName)
    {
        for (let i = 0; i < this.items.length; i++) if (this.items[i].name === itemName) return this.items[i];
    }

    generatePages()
    {
        this.pages = this.chunk(this.items, Settings.app_pageSize);
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