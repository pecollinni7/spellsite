class FileDrop
{
	_server;
	_selector;
	
	get server() { return this._server; }
	
	get selector()
	{
		if (this._selector === undefined)
			this._selector = $('#filedrop');
		
		return this._selector;
	}
	
	constructor(server)
	{
		this._server = server;
		
		$(window).on('dragenter', this.showDropZone);
		$('#filedrop').on('click', this.hideDropZone);
		$('#filedrop').on('dragleave', this.hideDropZone);
		$('#filedrop').on('dragenter', this.allowDrag);
		$('#filedrop').on('dragover', this.allowDrag);
		document.getElementById('filedrop').addEventListener('drop', (e) => {
			
			e.preventDefault();
			setTimeout(() => {
				$('#filedrop').removeClass('show')
			}, 1000);


			// console.log(e.dataTransfer.getData('html'));
			// console.log(e.dataTransfer.getData('text'));
			// console.log(e.dataTransfer.getData('text/html').find('img'));


			var droppedHTML = e.dataTransfer.getData("text/html");
			var dropContext = $('<div>').append(droppedHTML);
			var imgURL = $(dropContext).find("img").attr('src');

			console.log(dropContext);



			// console.log(e.dataTransfer.files);
			// this.server.uploadMedia(e.dataTransfer.files);

			// for (let i = 0; i < e.originalEvent.dataTransfer.files.length; i++)
			// {
			// 	this.server.uploadMedia(e.originalEvent.dataTransfer.files.item(i));
			//
			// }
		});
		
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
	
	// handleDrop(e)
	// {
	// 	e.preventDefault();
	// 	// hideDropZone();
	//
	// 	// const info = fileHandler.getDropInfo(e);
	// 	// console.log(info.files);
	//
	// 	// fileHandler.processDropData(e);
	// 	setTimeout(() => {
	// 		$('#filedrop').removeClass('show')
	// 	}, 1000);
	//
	//
	//
	// 	for (let i = 0; i < e.originalEvent.dataTransfer.files.length; i++)
	// 	{
	// 		console.log(this);
	// 		console.log(e.originalEvent.dataTransfer.files.item(i));
	// 		// this._server.uploadMedia(e.originalEvent.dataTransfer.files.item(i));
	//
	// 	}
	// }
}

module.exports = FileDrop;





