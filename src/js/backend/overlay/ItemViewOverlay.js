const OverlayBase = require('./OverlayBase');
const Settings    = require('../Settings');
const ImageSize   = require('image-size');
const Path        = require('path');

module.exports = class ItemViewOverlay extends OverlayBase
{
    _fileName;
    _ext;
    _filePath;

    get fileName() { return this._fileName; }
    set fileName(value) { this._fileName = value; }
    get ext() { return this._ext; }
    set ext(value) { this._ext = value; }
    get filePath() { return this._filePath; }
    set filePath(value) { this._filePath = value; }

    constructor(overlayManager)
    {
        super(overlayManager);
        super.selector = $('#overlay');
    }

    init()
    {
        super.init();
    }

    show(fileName)
    {
        this.fileName = fileName;
        this.ext      = Path.extname(this.fileName);
        this.filePath = Settings.getMediaPathForFileName(this.fileName);

        this.selector.html(this.generateHtml()); //append
        this.selector.addClass('show');
        this.selector.css('visibility', 'visible');
        $('#navigation').removeClass('faded');

        switch (this.ext)
        {
            case '.jpg':
            case '.png':
            case '.tga':
            case '.tiff':
            case '.bmp':
            case '.gif':
                setTimeout(() => {
                    $('#gifContent').css('pointer-events', 'auto')
                }, 50);
                break;

            case '.mp4':
                let mouseX;
                let video = $('#videoOverlay').get(0);

                $('#videoOverlay').on('mousemove', function moveFunc(e) {

                    video.pause();
                    mouseX = e.offsetX;

                    let timV = video.duration;
                    let valV = (timV * mouseX / $(document).width());

                    valV              = Math.round(valV * 100) / 100;
                    video.currentTime = valV;
                });
                break;
        }
    }

    hide()
    {
        this.selector.on("webkitTransitionEnd transitionend", () => {
            if (this.selector.hasClass('show') === false)
            {
                this.selector.css('visibility', 'hidden');
                this.selector.empty();
                this.selector.off("webkitTransitionEnd transitionend");
            }
        });

        this.selector.removeClass('show');
        $('#gifContent').css('pointer-events', 'none');
    }

    generateHtml()
    {
        switch (this.ext)
        {
            case '.gif':
                const dimensions = ImageSize(this.filePath);
                const docHeight  = $(window).height();
                const docWidth   = $(window).width();
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

                return "<div id='gifContent' class='gifContent'>" +
                    // "<img id='gifLoader' src=" + "../images/loading.gif" + ">" +
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
                return "<div class='imageOverlay'>" +
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


};