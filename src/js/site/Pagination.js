class Pagination
{
	
	_pages = [];
	_currentPage;
	_html;
	
	constructor()
	{
		// this._html = this.generateHtml();
	}
	
	
	set html(value) { this._html = value; }
	
	get html() { return this._html; }
	
	set currentPage(value) { this._currentPage = value; }
	
	get currentPage() { return this._currentPage; }
	
	generateHtml(numPages)
	{
		let res = "";
		
		//left arrow
		res += "<li><a class='page-link' onmousedown='callPrevPage(this)'>&#9664;</a></li>";
		
		for (let i = 0; i < numPages; i++)
		{
			res += "<li><a class='page-link' onmousedown='setActivePage(this)'>" + i + "</a></li>";
		}
		
		//right arrow
		res += "<li><a class='page-link' onmousedown='callNextPage(this)'>&#9654;</a></li>";
		
		this.html = res;
		// return res;
		this.deployHtml();
	}
	
	deployHtml()
	{
		$('#pagination').html(this.html);
	}
}

module.exports = Pagination;
