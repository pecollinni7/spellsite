const ContentPages = require('./ContentPages');
const Pagination   = require('./Pagination');
const Tags         = require('./Tags');
const Data         = require('./Data');

class Site
{
	_pagination;
	_tags;
	_contentPages;
	_data;
	_overlay;

	constructor()
	{
		this._pagination   = new Pagination();
		this._tags         = new Tags();
		this._contentPages = new ContentPages();
		this._data         = new Data();
	}

	generateContentPages(tagsFilter = undefined)
	{
		this._contentPages.generatePages(this._data.getFileNames(tagsFilter));
	}



}