class Pagination
{
	pages = [];
	currentPage;


	constructor() {}

	addPage()
	{
		this.pages.push()
	}

	set currentPage(num)
	{
		this.currentPage = num;
	}

	get currentPage()
	{
		return this.currentPage;
	}
}

module.exports = Pagination;
