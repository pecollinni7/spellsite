const Content = require('./Content');

class ContentPages
{
	_contentPages = [];
	_activePage;
	_pageSize     = 30;

	constructor()
	{

	}

	get pageSize() { return this._pageSize; }

	get contentPages() { return this._contentPages; }

	set contentPages(value) { this._contentPages = value; }

	get activePage() { return this._activePage; }

	set activePage(value) { this._activePage = value; }

	generatePages(fileNames)
	{
		const pageFileNameChunks = this.#getPageChunks(fileNames, this.pageSize);

		pageFileNameChunks.forEach(pageChunk => {
			this._contentPages.push(new Content(pageChunk))
		});
	}

	#getPageChunks(items, chunkSize)
	{
		let R = [];
		for (let i = 0; i < items.length; i += chunkSize)
		{
			//potential error if chunk size is bigger then array.length
			R.push(items.slice(i, i + chunkSize));
		}

		return R;
	}

	getPage(value)
	{
		return this._contentPages[value];
	}

}

