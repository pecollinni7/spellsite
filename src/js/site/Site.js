const ContentPages = require('./ContentPages');
const Pagination   = require('./Pagination');
const Tags         = require('./Tags');
const Overlay      = require('./Overlay');
const Data         = require('./Data');

class Site
{
	_pagination;
	_tags;
	_contentPages;
	_overlay;
	
	get overlay() { return this._overlay; }
	
	get pagination() { return this._pagination; }
	
	get tags() { return this._tags; }
	
	get contentPages() { return this._contentPages; }
	
	constructor()
	{
		this._contentPages = new ContentPages();
		this._pagination   = new Pagination();
		this._tags         = new Tags();
		this._overlay      = new Overlay();
		
		this.initialize();
	}
	
	initialize()
	{
		//try get some settings first
		
		this.generateContentPages();
		this.pagination.generateHtml(this.contentPages.numOfPages);
		this.tags.generateTags(Data.tagsList);
		
		
	}
	
	generateContentPages(tagsFilter = undefined)
	{
		this.contentPages.generatePages(Data.getFileNames(tagsFilter));
	}
	
	handleItemClick(item)
	{
		this.contentPages.activePage.clearSelection();
		this.contentPages.activePage.getItemByName($(item).attr('data-filename')).toggleSelection();
		this.tags.clearSelection();

		// this.contentPages.activePage.getSelectedItemNames().forEach(itemName => {
		// 	this.tags.
		// });
		
		// const selection = getSelectedItemFileNames();
		// if (selection)
		// {
		// 	for (let i = 0; i < selection.length; i++)
		// 	{
		// 		tags.displayTags(tags.getTagsForSource(selection[i]));
		// 	}
		// }
	}
	
	
}

module.exports = Site;
