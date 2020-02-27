class EventHandlers
{
	_site;
	get site() { return this._site; }

	constructor(site)
	{
		this._site = site;



		$('#tags').on('tagClick', function (e, tagElement, tagName) {
			site.handleTagClick(tagElement.innerText);
		});

		jQuery(function () {
			$(document).on('mousedown', function (e) {
				const element = $(e.target);

				if (element.hasClass('navigation') ||
					element.hasClass('pagination') ||
					element.hasClass('content') ||
					element.hasClass('html') ||
					element.hasClass('tags'))
				{
					site.contentPages.activePage.clearSelection();
					site.tags.clearSelection();
				}
			});
		});



	}



}

module.exports = EventHandlers;