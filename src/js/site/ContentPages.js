const Content = require('./Content');

class ContentPages
{
	_contentPages    = [];
	_activePageIndex = 0;
	_pageSize        = 30;
	_activePage;
	_filterMode      = false;
	_filterModeSelectedTags;
	
	constructor()
	{
		this.filterMode             = false;
		this.filterModeSelectedTags = [];
	}
	
	
	get filterModeSelectedTags()
	{
		return this._filterModeSelectedTags;
	}
	
	set filterModeSelectedTags(value)
	{
		this._filterModeSelectedTags = value;
	}
	
	get filterMode() { return this._filterMode; }
	
	set filterMode(value) { this._filterMode = value; }
	
	get pageSize() { return this._pageSize; }
	
	get contentPages() { return this._contentPages; }
	
	set contentPages(value) { this._contentPages = value; }
	
	get activePageIndex() { return this._activePageIndex; }
	
	set activePageIndex(value) { this._activePageIndex = value; }
	
	get numOfPages() {return this.contentPages.length;}
	
	get activePage() {return this.contentPages[this.activePageIndex];}

	
	generatePages(fileNames, fileTags)
	{
		this.contentPages = [];
		
		const pageFileNameChunks = this.getPageChunks(fileNames, this.pageSize);
		
		pageFileNameChunks.forEach(pageFileNames => {
			this.contentPages.push(new Content(pageFileNames, fileTags))
		});
		
		this.deployActivePage();
	}
	
	getPageChunks(items, chunkSize)
	{
		let R = [];
		for (let i = 0; i < items.length; i += chunkSize)
		{
			//TODO potential error if chunk size is bigger then array.length
			R.push(items.slice(i, i + chunkSize));
		}
		
		return R;
	}
	
	deployActivePage()
	{
		let activePageHtml = '';
		if (this.activePage !== undefined)
		{
			activePageHtml = this.activePage.html;
		}
		
		$('#content').html(activePageHtml);
	}
	
	getSelectedItems()
	{
		let res = [];
		
		if (this.activePage !== undefined)
		{
			res = this.activePage.getSelectedItems();
		}
		
		return res;
	}
}

module.exports = ContentPages;
