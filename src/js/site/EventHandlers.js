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
			this.site.tags.mainGrid.layout();
		});
		
		$(window).on('resize', () => {
			clearTimeout(window.resizedFinished);
			window.resizedFinished = setTimeout(() => {
				if ($('#navigation').hasClass('inactive') === false) {
					this.site.tags.mainGrid.layout();
				}
			}, 200);
		});
		
		
		$('#tags').on('tagClick', function (e, tagElement, tagName) {
			site.handleTagClick(tagElement.innerText);
		});
		
		$(document).on('keydown', e => {
			this.ctrlKey = e.ctrlKey;

			// if (e.keyCode === 38) {
			// 	console.log('up arrow');
			// }
			// else if (e.keyCode === 40) {
			// 	console.log('down arrow');
			// }
			if (e.keyCode === 37) {
				this.site.callPreviousPage();
			}
			else if (e.keyCode === 39) {
				this.site.callNextPage();
			}
		});
		
		$(document).on('keyup', e => {
			this.ctrlKey = e.ctrlKey;
		});
		
		$(document).on('newFilesArrived', () => {
			console.log("newFilesArrived triggered");
			this.site.generatePagesAndPagination();
		});

		$(document).on('newDataArrived', () => {
			this.site.generatePagesAndPagination();
		});
		
		// jQuery(function () {
		$(document).on('mousedown', e => {
			const element = $(e.target);
			
			
			if (element.hasClass('navigation') ||
				element.hasClass('pagination') ||
				element.hasClass('content') ||
				element.hasClass('html') ||
				element.hasClass('tags'))
			{
				
				if (site.contentPages.filterMode === false)
				{
					site.contentPages.activePage.clearSelection();
					site.tags.clearSelection();
				}
				else
				{
					if (site.contentPages.getSelectedItems().length > 0)
					{
						site.contentPages.activePage.clearSelection();
						site.tags.clearSelection();

						//load only filter tags
						site.contentPages.filterModeSelectedTags.forEach(tag => {
							site.tags.toggleTagByName(tag, true);
						})
					}
					else
					{
						site.contentPages.filterMode = false;
						site.generatePagesAndPagination();
					}
				}

			}
		});



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
					console.log('end = ' + e.clientY);
					// site.openContextMenu(e, e.clientX - 5, e.clientY - 5);
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
