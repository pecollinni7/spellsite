const Path      = require('path');
const Settings = require('./Settings');
const ImageSize = require('image-size');

class Overlay
{
	_fileName;
	_html;
	_ext;
	_filePath;
	_selector;
	_documentWidth;
	
	
	get fileName() { return this._fileName; }
	
	get html() { return this._html; }
	
	get ext() { return this._ext; }
	
	get filePath() { return this._filePath; }
	
	get selector() { return this._selector; }
	
	constructor(fileName)
	{
		this._fileName = fileName;
		this._ext      = Path.extname(this.fileName);
		this._selector = $('#overlay');
		this._filePath = Settings.getSettings('path.media') + '/' + this.fileName;
		this._html     = this.generateHtml();
	}
	
	generateHtml()
	{
		switch (this.ext)
		{
			case '.gif':
				const dimensions = ImageSize(this.filePath);
				const docHeight = $(window).height();
				const docWidth = $(window).width();
				let multiplier;

				const xmult = (docWidth / 100 * 80) / dimensions.width;
				const ymult = (docHeight / 100 * 60) / dimensions.height;

				if (xmult > ymult)
				{
					multiplier = ymult;
				}
				else
				{
					multiplier = xmult;
				}

				// if (dimensions.width < dimensions.height)
				// {
				// 	multiplier = (docHeight / 100 * 60) / dimensions.height ;
				// }
				// else
				// {
				// 	multiplier = (docWidth / 100 * 80) / dimensions.width ;
				// }

				const gifSizeX = dimensions.width * multiplier;
				const gifSizeY = dimensions.height * multiplier;

				return 	"<div id='gifContent' class='gifContent'>" +
							"<img id='gifLoader' src=" + "../images/loading.gif" + ">" +
								"<gif-player class='gifPlayer' src=" + this.filePath +
								" size='contain' speed='1' play prerender style='" +
								// "width:" + ($(document).width() / 100 * 70) + "px; " +
								// "height:" + ($(document).height() / 100 * 50) + "px; " +
								"width:" + gifSizeX + "px; " +
								"height:" + gifSizeY + "px; " +
								"position: center; display: block'>" +
						"</div>";
			
			case '.png':
			case '.jpg':
			case '.bmp':
			case '.tiff':
			case '.tga':
				return 	"<div class='imageOverlay'>" +
						"<img src=" + this.filePath + ">" +
						"</div>";
			
			case '.mp4':
				return "<video class='videoOverlay' id='videoOverlay' autoplay loop muted>" +
					   "<source id='videoSource' src=" + this.filePath + " type='video/" + this.ext.replace('.', '') + "'>" +
					   "</video>";
			
			default:
				return '';
		}
	}
	
	
	deployHtml()
	{
		this.selector.append(this.html);
	}
	
	async showOverlay()
	{
		this.deployHtml();
		this.selector.addClass('show');
		this.selector.css('visibility', 'visible');
		$('#navigation').removeClass('faded');
		
		switch (this.ext)
		{
			case '.gif':
				setTimeout(() => {
					$('#gifContent').css('pointer-events', 'auto')
				}, 30);
				break;
			
			case '.mp4':
				let mouseX;
				let video = $('#videoOverlay').get(0);
				let docWidth = $(document).width();
				let timV = video.duration;

				$('#videoOverlay').on('mousemove', function moveFunc(e) {

					video.pause();
					mouseX = e.offsetX;
					
					// let valV = (timV * mouseX / $(document).width());
					let valV = (timV * mouseX / docWidth);

					valV              = Math.round(valV * 100) / 100;
					video.currentTime = valV;
				});
				break;
		}
	}
	
	
	hideOverlay()
	{
		this.selector.on("webkitTransitionEnd transitionend", () => {
			if (this.selector.hasClass('show') === false)
			{
				this.selector.css('visibility', 'hidden');
				this.selector.empty();
				this.selector.off("webkitTransitionEnd transitionend");
			}
		});

		$('#videoOverlay').off('mousemove');
		
		this.selector.removeClass('show');
		// this.selector.css('visibility', 'hidden');
		
		
		// const scroll = this.scrollY;
		// if (scroll > $('#navigation').height())
		// {
		// 	$('#navigation').addClass('faded');
		// }
		// else
		// {
		// 	$('#navigation').removeClass('faded');
		// }
	}
	
	
}

module.exports = Overlay;
