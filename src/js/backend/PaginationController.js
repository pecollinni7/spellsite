const DataService = require('./DataService');

class PaginationController
{
    _html;

    get html() { return this._html; }
    set html(value) { this._html = value; }
    get paginationSelector() {return $('#pagination');}

    constructor() {}

    generate(numPages)
    {
        let res = "";

        //left arrow
        res += "<li><a class='page-link' onmousedown='site.callPreviousPage()'>&#9664;</a></li>";

        // numPages = numOfItems / pageSize
        for (let i = 0; i < numPages; i++)
        {
            res += "<li><a class='page-link' onmousedown='site.setActivePage(" + i + ")'>" + i.toString() + "</a></li>";
        }

        //right arrow
        res += "<li><a class='page-link' onmousedown='site.callNextPage()'>&#9654;</a></li>";

        // return res;
        this.html = res;
        this.deployHtml(this.html);
        // this.pages = $('#pagination').children();
    }

    deployHtml(html)
    {
        $('#pagination').hide();

        $('#pagination').html(html);

        //TODO: this should go in the settings
        $('#pagination').fadeIn(200);
    }

    setActivePage(num)
    {

        if (num === undefined) return;

        num = parseInt(num);

        if (num >= this.paginationSelector.children().length - 2)
            num = this.paginationSelector.children().length - 3;

        if (num < 0) num = 0;

        DataService.activePageIndex = num;

        // this.activePageIndex = num;

        this.paginationSelector.children().children().removeClass('active-link');
        this.paginationSelector.children().children().eq(num + 1).addClass('active-link');
        // $('#pagination').children().removeClass('active-link');

        // this.activeButton = btn;
        // this.activeButton.classList.add('active-link');

        // this.addActiveLink(parseInt(btn));
    }

}

module.exports = PaginationController;