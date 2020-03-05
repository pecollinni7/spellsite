const ContentPages  = require('./ContentPages');
const Pagination    = require('./Pagination');
const Tags          = require('./Tags');
const FileDrop      = require('./FileDrop');
const Data          = require('./Data');
const EventHandlers = require('./EventHandlers');
const Overlay       = require('./Overlay');
const TagOverlay    = require('./TagOverlay');
const Server        = require('../../js/server/Server');


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
	_tagOverlay;

	get server() { return this._server; }

	get overlay() { return this._overlay; }

	set overlay(value) { this._overlay = value; }

	get fileDrop() { return this._fileDrop; }

	get pagination() { return this._pagination; }

	get tags() { return this._tags; }

	get contentPages() { return this._contentPages; }

	get eventHandlers() { return this._eventHandlers; }

	get tagOverlay() { return this._tagOverlay; }

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
		this._server        = new Server(this);
		this._fileDrop      = new FileDrop(this.server);
		this._eventHandlers = new EventHandlers(this);
		this._tagOverlay    = new TagOverlay();

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

	handleItemClick(item, e)
	{
		if (e.button === 2)
		{
			console.log('right click over item');
			return;
		}

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
		this.overlay   = new Overlay(itemName);
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
			} else
			{
				this.contentPages.filterMode             = false;
				this.contentPages.filterModeSelectedTags = [];
				this.generatePagesAndPagination();
			}
		} else
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

	showChoseDirectory()
	{
		$("#loaderContent").css('visibility', 'visible');
	}

	choseMediaDirectory()
	{
		const Settings = require('./Settings');
		const {dialog} = require('electron').remote;

		dialog.showOpenDialog({
			properties: ['openDirectory'],
		}).then(r => {
			if (r.filePaths[0])
			{
				Settings.setSettings(r.filePaths[0]);
				Settings.createDefaults();

				$("#loaderContent").hide("slow");
				this.initialize();
			}
		});
	}

	addTagButton()
	{
		this.tagOverlay.showTagOverlay();
	}

	addTagButtonConfirm()
	{
		if (!this.tagOverlay.tagExistsInTagTypes() && this.tagOverlay.inputText.length > 0)
		{
			this.tags.addTagToGrid(this.tagOverlay.inputText);
			this.tagOverlay.removeTagOverlay();
			
			this.server.actionPerformed();
		}
	}

	addTagButtonCancel()
	{
		this.tagOverlay.removeTagOverlay();
	}

	deleteTag()
	{
		this.tags.removeItemsFromGrid(this.tags.currentTagName);
	}

	deleteSelectedItems()
	{
		this.contentPages.activePage.removeSelectedItems();
		this.generatePagesAndPagination();
	}


	openContextMenu(e, mouseX, mouseY)
	{
		let contextmenu;

		if ($(e.target).hasClass('image') || $(e.target).hasClass('videoInsert'))
		{
			contextmenu = $('#itemcontextmenu');
			// this.contentPages.activePage.getItemByName($(e.target).attr('data-filename')).toggleSelection();
		}

		if ($(e.target).hasClass('item-content'))
		{
			contextmenu = $('#tagcontextmenu');
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
