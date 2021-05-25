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

        $('#gifContent').css('pointer-events', 'none');

        $('#overlay').on('mousemove', (e) => {
            $('#gifContent').css('pointer-events', 'auto');
            $('#overlay').off('mousemove');
        })

        $('#overlay').html(this.generateHtml()); //append
        $('#overlay').addClass('show');
        $('#overlay').css('visibility', 'visible');
        $('#navigation').removeClass('faded');

        switch (this.ext)
        {
            case '.gif':
                // $('#gifContent').css('pointer-events', 'auto');

                // setTimeout(() => {
                //     $('#gifContent').css('pointer-events', 'auto')
                // }, 100);
                break;

            case '.jpg':
            case '.png':
            case '.tga':
            case '.tiff':
            case '.bmp':

                let imgElement = document.getElementById('overlay').childNodes[0].childNodes[0];
                wheelzoom(imgElement, {zoom:0.45, dragMultiplier:2});

                imgElement.addEventListener('mousedown', function(e) {
                    imgElement.classList.remove('interactive');
                })

                imgElement.addEventListener('mouseup', function(e) {
                    imgElement.classList.add('interactive');
                })

                break;

            case '.mp4':
                let mouseX;
                let videoOverlay = $('#videoOverlay');
                let video        = $(videoOverlay).get(0);

                $(videoOverlay).on('mouseenter', (e) => {
                    video.pause();
                });

                $(videoOverlay).on('mouseleave', (e) => {
                    video.play();
                });

                $(videoOverlay).on('mousemove', function moveFunc(e) {

                    mouseX           = e.offsetX;
                    const timV       = video.duration;
                    const docWidth   = $(document).width();
                    const videoWidth = $(video).width();

                    let valV = (timV * mouseX / (docWidth - (docWidth - videoWidth)));
                    valV     = Math.round(valV * 100) / 100;

                    video.currentTime = valV;
                });

                break;
        }
    }

    hide()
    {

        //TODO: this.selector is maybe not working :/
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
        $('#videoOverlay').off();
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
                    "<gif-player class='gifPlayer' id='gifPlayer' src=" + this.filePath +
                    " size='contain' speed='1' play prerender style='" +
                    // "width:" + ($(document).width() / 100 * 70) + "px; " +
                    // "height:" + ($(document).height() / 100 * 50) + "px; " +
                    "width:" + gifSizeX + "px; " +
                    "height:" + gifSizeY + "px; " +
                    "position: center; display: block'>" +
                    "</div>";

                //TODO: only include supported filetypes
            case '.png':
            case '.jpg':
            case '.bmp':
            case '.tiff':
            case '.tga':
                return "<div class='imageOverlay'>" +
                    "<img class='interactive' src=" + this.filePath + ">" +

                    "</div>";

            case '.mp4':
                return "<video class='videoOverlay' id='videoOverlay' autoplay loop muted>" +
                    "<source id='videoSource' src=" + this.filePath + " type='video/" + this.ext.replace('.', '') + "'>" +
                    "</video>";

            default:
                return '';
        }
    }

    /*async showOverlay()
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
     }*/

};