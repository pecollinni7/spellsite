const ContentController = require('./ContentController');
const TagsController    = require('./TagsController');
const EventHandlers     = require('./EventHandlers');
const DataService       = require('./DataService');
const Overlay           = require('./Overlay')
const remote            = require('electron').remote;

class Site
{
    _contentController;
    _paginationController;
    _tagsController;
    _eventHandlers;
    _overlay;

    get contentController() {return this._contentController;}
    set contentController(value) {this._contentController = value;}
    get paginationController() {return this._paginationController;}
    set paginationController(value) {this._paginationController = value;}
    get eventHandlers() { return this._eventHandlers; }
    set eventHandlers(value) { this._eventHandlers = value; }
    get tagsController() { return this._tagsController; }
    set tagsController(value) { this._tagsController = value; }
    get overlay() { return this._overlay; }
    set overlay(value) { this._overlay = value; }

    constructor()
    {
        this.contentController = new ContentController();
        // this.paginationController = new PaginationController();
        this.tagsController    = new TagsController();
        this.eventHandlers     = new EventHandlers(this);
    }

    initialize()
    {
        this.contentController.generate();
        // this.paginationController.generate(this.contentController.numOfPages);
        this.tagsController.generate();

        // this.setActivePage(0);
    }

    handleItemClick(item, e)
    {
        if (this.eventHandlers.ctrlKey === false)
        {
            this.contentController.clearSelection();
            this.tagsController.clearSelection();

            this.contentController.toggleItemSelection(item);
        }
        else
        {
            this.contentController.toggleItemSelection(item);
        }

        this.tagsController.displaySelectedItemsActiveTags();
    }

    handleItemDoubleClick(item)
    {
        this.overlay = new Overlay($(item).attr('data-filename'));
        this.overlay.showOverlay().then();

        //workaround for ctrl + toggle click on the item. it can deselect the item prior to overlay view
        const itemObj = this.contentController.getItemByName($(item).attr('data-filename'));
        if (itemObj.isSelected === false)
        {
            itemObj.select();
        }
    }

    handleTagClick(tagName)
    {

        if (DataService.isSelectionEmpty)
        {
            this.tagsController.toggleTag(tagName, true);

            if (this.tagsController.hasActiveTags)
            {
                DataService.filterMode     = true;
                DataService.filterModeTags = this.tagsController.activeTags;
                this.contentController.generate();
            }
            else
            {
                DataService.filterMode     = false;
                DataService.filterModeTags = [];
                this.contentController.generate();
            }
        }
        else
        {
            this.tagsController.toggleTag(tagName);
            // this.server.actionPerformed();
        }
    }

    callNextPage()
    {
        // this.tags.clearSelection();
        this.setActivePage(DataService.activePageIndex + 1);
    }

    callPreviousPage()
    {
        // this.tags.clearSelection();
        this.setActivePage(DataService.activePageIndex - 1);

    }

    setActivePage(pageNum)
    {
        this.contentController.deployPage(pageNum);
        // this.paginationController.setActivePage(pageNum);
        // this.tags.clearSelection();

        // DataService.selectedItems.forEach(item => {
        //     this.contentController.getItemByName(item.name).select();
        // })
    }

    reloadPage()
    {
        remote.getCurrentWindow().reload();
    }

    clearSelection()
    {
        if (DataService.filterMode && DataService.isSelectionEmpty)
        {
            this.tagsController.clearFilterSelection();
            this.contentController.generate();
        }
        else
        {
            this.contentController.clearSelection();
            this.tagsController.clearSelection();
        }
    }

    openContextMenu(e, mouseX, mouseY)
    {
        let contextmenu;

        if ($(e.target).hasClass('image') || $(e.target).hasClass('videoInsert'))
        {
            contextmenu = $('#itemcontextmenu');
            this.contentController.getItemByName($(e.target).attr('data-filename')).select();
        }

        if ($(e.target).hasClass('item-content'))
        {
            contextmenu = $('#tagcontextmenu');
            const currentTagName = $(e.target).text();
            $( "#tagcontextmenu" ).children().first().text('Delete tag ' + currentTagName);
        }


        contextmenu.css({top: mouseY, left: mouseX, position: 'fixed'});
        contextmenu.addClass('show');


        contextmenu.on('mouseleave', () => {
            contextmenu.removeClass('show');
        });

        $(window).on('mousedown', () => {
            contextmenu.removeClass('show');
        });
        $(window).on('scroll', () => {
            contextmenu.removeClass('show');
        });
    }

}

module.exports = Site;