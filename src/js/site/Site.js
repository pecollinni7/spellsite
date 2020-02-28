const ContentPages  = require('./ContentPages');
const Pagination    = require('./Pagination');
const Tags          = require('./Tags');
const Overlay       = require('./Overlay');
const Data          = require('./Data');
const EventHandlers = require('./EventHandlers');

const remote        = require('electron').remote;
// require('events').EventEmitter.defaultMaxListeners = 5;


class Site
{
	_pagination;
	_tags;
	_contentPages;
	_overlay;
	_eventHandlers;

	get overlay() { return this._overlay; }

	get pagination() { return this._pagination; }

	get tags() { return this._tags; }

	get contentPages() { return this._contentPages; }

	get eventHandlers() { return this._eventHandlers; }


	constructor()
	{
		this._contentPages  = new ContentPages();
		this._pagination    = new Pagination();
		this._tags          = new Tags();
		this._overlay       = new Overlay();
		this._eventHandlers = new EventHandlers(this);

		this.initialize();
	}

	initialize()
	{
		//try get some settings first

		this.generateContentPages();
		this.pagination.generateHtml(this.contentPages.numOfPages);
		this.tags.generateTags(Data.tagsList);
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
		this.contentPages.activePage.clearSelection();
		this.contentPages.activePage.getItemByName($(item).attr('data-filename')).toggleSelection();
		this.tags.displayTagsByName(this.contentPages.activePage.getSelectedItemsTags());
	}

	handleTagClick(tagName)
	{
		const selectedItems = this.contentPages.activePage.getSelectedItems();
		this.tags.toggleTagByName(tagName);

		if (selectedItems !== undefined && selectedItems.length > 0)
		{
			this.contentPages.activePage.updateTagsForSelectedItems(tagName, this.tags.getTagValue(tagName));
		}
		else
		{
			this.contentPages.generatePages(Data.getFileNames(this.tags.getActiveTagNames()), Data.getFileTags());
		}
	}

}

module.exports = Site;
