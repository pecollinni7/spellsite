class Overlay
{
	_selector;

	get selector()
	{
		if (this._selector === undefined)
			this._selector = $('#filedrop');

		return this._selector;
	}

	constructor()
	{
		$(window).on('dragenter', this.showDropZone);
		$('#filedrop').on('click', this.hideDropZone);
		$('#filedrop').on('dragleave', this.hideDropZone);
		$('#filedrop').on('dragenter', this.allowDrag);
		$('#filedrop').on('dragover', this.allowDrag);
		$('#filedrop').on('drop', this.handleDrop);

		$('#filedrop').on('webkitTransitionEnd transitionend', () => {
			if (!$('#filedrop').hasClass('show'))
				$('#filedrop').css('visibility', 'hidden');
		});

	}

	showDropZone()
	{
		$('#filedrop').addClass('show');
		$('#filedrop').css('visibility', 'visible');
	}

	hideDropZone()
	{
		$('#filedrop').removeClass('show');
	}

	allowDrag(e)
	{
		if (true)
		{  // Test that the item being dragged is a valid one
			e.originalEvent.dataTransfer.dropEffect = 'copy';
			e.preventDefault();
		}
	}

	handleDrop(e)
	{
		e.preventDefault();
		// hideDropZone();

		// const info = fileHandler.getDropInfo(e);
		// console.log(info.files);

		// fileHandler.processDropData(e);
		setTimeout(this.hideDropZone, 1000);
		console.log(e.files);
		// server.uploadMedia(e.dataTransfer.files);
	}
}

module.exports = Overlay;





