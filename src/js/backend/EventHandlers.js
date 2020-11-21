const DataService = require('./DataService');

class EventHandlers
{
	_site;
	_ctrlKey;
	
	get site() { return this._site; }
	get ctrlKey() { return this._ctrlKey; }
	set ctrlKey(value) { this._ctrlKey = value; }
	
	
	constructor(site)
	{
		this._site   = site;
		this.ctrlKey = false;


		
		$('#navigation').on('hide.bs.collapse', () => {
			$('#content').css('margin-top', 0);
		});
		
		$('#navigation').on('show.bs.collapse', () => {
			$('#content').css('margin-top', $('#navigation').height() + 30 );
		});

		$('#navigation').on('shown.bs.collapse', () => {
			// grid1.layout();
			this.site.tagsController.mainGrid.layout();
		});
		
		$(window).on('resize', () => {
			clearTimeout(window.resizedFinished);
			window.resizedFinished = setTimeout(() => {
				if ($('#navigation').hasClass('inactive') === false) {
					this.site.tagsController.mainGrid.layout();
				}
			}, 200);
		});

		
		$('#tags').on('tagClick', function (e, tagElement, tagName) {
			site.handleTagClick(tagElement.innerText);
		});
		
		$(document).on('keydown', e => {

			this.ctrlKey = e.ctrlKey;

			switch (e.keyCode)
			{
				case 37: this.site.callPreviousPage(); break;	//left
				case 39: this.site.callNextPage(); break;		//right
				case 27: this.site.clearSelection(); break;		//escape
			}
		});
		
		$(document).on('keyup', e => {
			this.ctrlKey = e.ctrlKey;
		});
		
		$(document).on('newFilesArrived', () => {
			if (this.site.contentPages.activePage)
				this.site.contentPages.activePage.holdSelection();

			this.site.generatePagesAndPagination();
			// this.site.tags.update();
			this.site.tags.generateTagsFromData();


			if (this.site.contentPages.activePage)
				this.site.contentPages.activePage.restoreSelection();

			this.site.updateDataFileVersionLabel();
		});

		$(document).on('newDataArrived', () => {
			// if (this.site.contentPages.activePage)
			// 	this.site.contentPages.activePage.holdSelection();

			// this.site.generatePagesAndPagination();
			// this.site.tags.generateTagsFromData();
			// this.site.tags.sortGridByDataListOrder();


			// if (this.site.contentPages.activePage)
			// 	this.site.contentPages.activePage.restoreSelection();

			// if (this.site.contentPages.activePage !== undefined)
			// 	this.site.tags.displayTagsByName(this.site.contentPages.activePage.getSelectedItemsTags());

			this.site.updateDataFileVersionLabel();
		});

		// jQuery(function () {
		$(document).on('mousedown', e => {
			const element = $(e.target);

			if (element.hasClass('navigation') 	||
				element.hasClass('pagination') 	||
				element.hasClass('content') 		||
				element.hasClass('html') 		||
				element.hasClass('tags'))
			{
				this.site.clearSelection();
			}
		});

		// $('#tags').contextmenu(function() {
		// 	alert( "Handler for .contextmenu() called." );
		// });




			let clicked = false,
			clickY,
			clickYStart;
		$(document).on({
			// 'mousemove': function (e) {
			// 	clicked && updateScrollPos(e);
			// },
			'mousedown': (e) => {
				if (e.which === 3)
				{
					clicked     = true;
					clickY      = e.pageY;
					clickYStart = e.clientY;
				}
			},
			'mouseup': (e) => {
				clicked = false;
				$('html').css('cursor', 'auto');
				if (clickYStart === e.clientY)
				{
					// console.log('end = ' + e.clientY);
					site.openContextMenu(e, e.clientX - 5, e.clientY - 5);
				}
			}
		});

		// window.addEventListener("contextmenu", e => {
		// 	console.log(e);
		// 	e.preventDefault();
		// });
		
		
		
		
		
	}
	
	
}

module.exports = EventHandlers;
