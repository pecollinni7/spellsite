class Pagination
{
	
	_pages;
	_currentPage;
	_html;
	_selector;
	_activeButton;
	
	constructor()
	{
		// this._html = this.generateHtml();
	}


	get selector()
	{
		return this._selector;
	}

	set selector(value)
	{
		this._selector = value;
	}

	set html(value) { this._html = value; }
	
	get html() { return this._html; }
	
	set currentPage(value) { this._currentPage = value; }
	
	get currentPage() { return this._currentPage; }

	get activeButton() { return this._activeButton; }

	set activeButton(value) { this._activeButton = value; }

	get pages() { return this._pages; }

	set pages(value) { this._pages = value; }


	generateHtml(numPages)
	{
		let res = "";
		
		//left arrow
		res += "<li><a class='page-link' onmousedown='site.callPreviousPage()'>&#9664;</a></li>";
		
		for (let i = 0; i < numPages; i++)
		{
			res += "<li><a class='page-link' onmousedown='site.setActivePage(" + i + ")'>" + i + "</a></li>";
		}
		
		//right arrow
		res += "<li><a class='page-link' onmousedown='site.callNextPage()'>&#9654;</a></li>";
		
		this.html = res;
		// return res;
		this.deployHtml();
		this.pages = $('#pagination').children();
	}

	setActiveButtonByIndex(index)
	{
		let num = index;

		if (index < 0)
		{
			num = 0;
		}

		if (index > this.pages.length-3)
		{
			num = this.pages.length-3;
		}

		this.removeActiveLink();
		this.addActiveLink(num);
	}

	removeActiveLink()
	{
		for (let i = 0; i < this.pages.length; i++)
			$(this.pages[i]).children().removeClass('active-link');
	}

	addActiveLink(index)
	{
		$(this.pages[index + 1]).children().addClass('active-link');
	}

	setActiveButton(btn)
	{
		if (btn === undefined)
		{
			return;
		}

		for (let i = 0; i < this.pages.length; i++)
			$(this.pages[i]).children().removeClass('active-link');

		// this.activeButton = btn;
		// this.activeButton.classList.add('active-link');

		this.addActiveLink(parseInt(btn));
	}
	
	deployHtml()
	{
		$('#pagination').html(this.html);
	}
}

module.exports = Pagination;
