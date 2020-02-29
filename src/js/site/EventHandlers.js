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
		//
		
		$('#tags').on('tagClick', function (e, tagElement, tagName) {
			site.handleTagClick(tagElement.innerText);
		});
		
		$(document).on('keydown', e => {
			this.ctrlKey = e.ctrlKey;
		});
		
		$(document).on('keyup', e => {
			this.ctrlKey = e.ctrlKey;
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
				
				
				if (site.contentPages.filterMode)
				{
					site.generatePagesAndPagination();
				}
				else
				{
					site.contentPages.activePage.clearSelection();
					site.tags.clearSelection();
				}
			}
		});
		// });
	}
	
	
}

module.exports = EventHandlers;
