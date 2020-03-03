const ContentPages  = require('./ContentPages');
const Pagination    = require('./Pagination');
const Tags          = require('./Tags');
const FileDrop      = require('./FileDrop');
const Data          = require('./Data');
const EventHandlers = require('./EventHandlers');
const Overlay       = require('./Overlay');
const Server  = require('../../js/server/Server');


const remote = require('electron').remote;

// require('events').EventEmitter.defaultMaxListeners = 5;


class Site
{
	_server;
	_pagination;
	_tags;
	_contentPages;
	_fileDrop;
	_eventHandlers;
	_overlay;

	get server() { return this._server; }
	
	get overlay() { return this._overlay; }
	
	set overlay(value) { this._overlay = value; }
	
	get fileDrop() { return this._fileDrop; }
	
	get pagination() { return this._pagination; }
	
	get tags() { return this._tags; }
	
	get contentPages() { return this._contentPages; }
	
	get eventHandlers() { return this._eventHandlers; }
	
	
	constructor()
	{
		// this._contentPages  = new ContentPages();
		// this._pagination    = new Pagination();
		// this._tags          = new Tags();
		// this._server  		= new Server(this);
		// this._fileDrop      = new FileDrop(this.server);
		// this._eventHandlers = new EventHandlers(this);
		//
		// this.initialize();
		//
		
	}
	
	initialize()
	{
		//try get some settings first
		this._contentPages  = new ContentPages();
		this._pagination    = new Pagination();
		this._tags          = new Tags();
		this._server  		= new Server(this);
		this._fileDrop      = new FileDrop(this.server);
		this._eventHandlers = new EventHandlers(this);
		
		this.generatePagesAndPagination();
		this.tags.generateTags(Data.tagsList);
		
		this.server.polling.run();
	}
	
	generatePagesAndPagination(tagsFilter = undefined)
	{
		this.generateContentPages(tagsFilter);
		this.pagination.generateHtml(this.contentPages.numOfPages);
		this.pagination.setActiveButtonByIndex(this.contentPages.activePageIndex);
		this.tags.clearSelection();
		
		if (this.contentPages.activePage !== undefined)
			this.contentPages.activePage.clearSelection();
	}
	
	reloadPage()
	{
		remote.getCurrentWindow().reload();
	}
	
	generateContentPages(tagsFilter = undefined)
	{
		this.contentPages.generatePages(Data.getFileNames(tagsFilter), Data.getFileTags());
	}
	
	handleItemClick(item)
	{
		if (!this.eventHandlers.ctrlKey)
		{
			this.contentPages.activePage.clearSelection();
		}
		
		this.contentPages.activePage.getItemByName($(item).attr('data-filename')).toggleSelection();
		this.tags.displayTagsByName(this.contentPages.activePage.getSelectedItemsTags());
		
		if (this.contentPages.filterMode && this.contentPages.isSelectionEmpty())
		{
			this.tags.displayTagsByName(this.contentPages.filterModeSelectedTags);
		}
	}
	
	handleItemDoubleClick(item)
	{
		const itemName = $(item).attr('data-filename');
		this.overlay = new Overlay(itemName);
		this.overlay.showOverlay();
	}
	
	handleTagClick(tagName)
	{
		if (this.contentPages.isSelectionEmpty())
		{
			this.tags.toggleTagByName(tagName, true);
			
			if (this.tags.activeTags().length > 0)
			{
				this.contentPages.filterMode             = true;
				this.contentPages.filterModeSelectedTags = this.tags.getActiveTagNames();
				this.contentPages.generatePages(Data.getFileNames(this.tags.getActiveTagNames()), Data.getFileTags());
				this.pagination.generateHtml(this.contentPages.numOfPages);
				this.pagination.setActiveButtonByIndex(this.contentPages.activePageIndex);
			}
			else
			{
				this.contentPages.filterMode             = false;
				this.contentPages.filterModeSelectedTags = [];
				this.generatePagesAndPagination();
			}
		}
		else
		{
			this.tags.toggleTagByName(tagName);
			this.contentPages.activePage.updateTagsForSelectedItems(tagName, this.tags.getTagValue(tagName));
			
			this.server.actionPerformed();
		}
	}

	callNextPage()
	{
		this.tags.clearSelection();
		this.pagination.setActiveButtonByIndex(this.contentPages.activePageIndex + 1);
		this.contentPages.deployPage(this.contentPages.activePageIndex + 1);
	}

	callPreviousPage()
	{
		this.tags.clearSelection();
		this.pagination.setActiveButtonByIndex(this.contentPages.activePageIndex - 1);
		this.contentPages.deployPage(this.contentPages.activePageIndex - 1);
	}


	setActivePage(pageNum)
	{
		this.pagination.setActiveButton(pageNum);
		this.tags.clearSelection();
		this.contentPages.deployPage(pageNum.innerText);
	}

	choseMediaDirectory()
	{
		const settings = require('electron').remote.require('electron-settings');
		const {dialog} = require('electron').remote;

		let paths = settings.has('path.media');

		if (paths === false)
		{
			// var path = dialog.showOpenDialog({properties: ['openDirectory']});
			dialog.showOpenDialog({
				properties: ['openDirectory'],
				// message: 'asd',
				// defaultPath: 'C:/',

			}).then(r => {

				if (r.filePaths[0])
				{
					console.log(r.filePaths[0]);

					$("#loaderContent").hide("slow");
					this.initialize();
				}
			});
		}
		// console.log(path);

	}
}

module.exports = Site;
