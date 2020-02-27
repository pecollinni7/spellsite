const Content = require('./Content');

class ContentPages
{
	_contentPages    = [];
	_activePageIndex = 0;
	_pageSize        = 30;
	
	constructor()
	{
	
	}
	
	get pageSize() { return this._pageSize; }
	
	get contentPages() { return this._contentPages; }
	
	set contentPages(value) { this._contentPages = value; }
	
	get activePageIndex() { return this._activePageIndex; }
	
	set activePageIndex(value) { this._activePageIndex = value; }
	
	get numOfPages() {return this.contentPages.length;}
	
	get activePage() {return this.contentPages[this.activePageIndex];}
	
	generatePages(fileNames, fileTags)
	{
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
		$('#content').html(this.activePage.html);
	}
}

module.exports = ContentPages;
