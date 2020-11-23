const ContentController = require('./ContentController');
const TagsController    = require('./TagsController');
const EventHandlers     = require('./EventHandlers');
const DataService       = require('./DataService');
const Data              = require('./Data');
const Overlay           = require('./Overlay');
const Server            = require('./Server');
const remote            = require('electron').remote;
const OverlayManager    = require('./OverlayManager');

class Site
{
    _contentController;
    _paginationController;
    _tagsController;
    _eventHandlers;
    _overlay;
    _server;

    _overlayManager;

    get om() {return this.overlayManager};
    get om_newTag() {return this.overlayManager.getOverlay(OverlayManager.NEW_TAG_OVERLAY);}
    get om_settings() {return this.overlayManager.getOverlay(OverlayManager.SETTINGS_OVERLAY);}
    get om_dropZone() {return this.overlayManager.getOverlay(OverlayManager.DROP_ZONE_OVERLAY);}
    get om_viewItem() {return this.overlayManager.getOverlay(OverlayManager.ITEM_VIEW_OVERLAY);}

    get contentController() {return this._contentController;}
    set contentController(value) {this._contentController = value;}
    get paginationController() {return this._paginationController;}
    set paginationController(value) {this._paginationController = value;}
    get server() { return this._server; }
    set server(value) { this._server = value; }
    get eventHandlers() { return this._eventHandlers; }
    set eventHandlers(value) { this._eventHandlers = value; }
    get tagsController() { return this._tagsController; }
    set tagsController(value) { this._tagsController = value; }
    get overlay() { return this._overlay; }
    set overlay(value) { this._overlay = value; }
    get overlayManager() { return this._overlayManager; }
    set overlayManager(value) { this._overlayManager = value; }

    constructor()
    {
        this.contentController = new ContentController();
        this.tagsController    = new TagsController();
        this.eventHandlers     = new EventHandlers(this);
        this.server            = new Server(this);

        this.overlayManager = new OverlayManager(this);
    }

    initialize()
    {
        this.contentController.generate();
        this.tagsController.generate();
        this.server.polling.run();

        this.updateDataFileVersionLabel();

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

        this.displaySelectedItemsActiveTags();
    }

    displaySelectedItemsActiveTags()
    {
        this.tagsController.displayTags(this.contentController.getSelectedItemsActiveTags());
    }

    handleItemDoubleClick(item)
    {
        this.overlay = new Overlay($(item).attr('data-filename'));
        this.overlay.showOverlay().then();

        //workaround for ctrl + toggle double click on the item. it can deselect the item prior to overlay view
        const itemObj = this.contentController.getItemByName($(item).attr('data-filename'));
        if (itemObj.isSelected === false)
        {
            itemObj.select();
        }
    }

    handleTagClick(tagName)
    {

        if (Data.isSelectionEmpty)
        {
            this.tagsController.toggleTag(tagName, true);

            if (this.tagsController.hasActiveTags)
            {
                Data.filterMode     = true;
                Data.filterModeTags = this.tagsController.activeTags;
                this.contentController.generate();
            }
            else
            {
                Data.filterMode     = false;
                Data.filterModeTags = [];
                this.contentController.generate();
            }
        }
        else
        {
            this.tagsController.toggleTag(tagName);
            this.server.actionPerformed();
        }
    }

    callNextPage()
    {
        // this.tags.clearSelection();
        this.setActivePage(Data.currentPageIndex + 1);
    }

    callPreviousPage()
    {
        // this.tags.clearSelection();
        this.setActivePage(Data.currentPageIndex - 1);

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

        if (Data.filterMode === true && Data.isSelectionEmpty === true)
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
            contextmenu          = $('#tagcontextmenu');
            const currentTagName = $(e.target).text();
            $("#tagcontextmenu").children().first().text('Delete tag ' + currentTagName);
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

    updateDataFileVersionLabel()
    {
        document.getElementById("version-dataFile").innerText = 'd' + DataService.version;
    }
}

module.exports = Site;