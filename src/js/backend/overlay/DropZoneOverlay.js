const OverlayBase              = require('./OverlayBase');
const {clipboard, ipcRenderer} = require('electron');
// const clipboardy  = require('clipboardy');
// const ipcMain = require('electron').ipcMain;
const fs = require('fs');

module.exports = class DropZoneOverlay extends OverlayBase
{
    get server() {return this.site.server;}

    constructor(overlayManager)
    {
        super(overlayManager);
    }

    show()
    {
        this.overlayManager.hideOverlay();
        $('#filedrop').addClass('show');
        $('#filedrop').css('visibility', 'visible');
    }

    hide()
    {
        $('#filedrop').removeClass('show');
    }

    // getClipboardMultiple()
    // {
    //     ipcRenderer.send("clipboad-multiple-get");
    // }

    init()
    {

        /*$(window).on('keydown', e => {
            if (e.ctrlKey && e.keyCode === 86)
            {
                e.stopPropagation();
                e.preventDefault();

                const res = clipboard.readBuffer("CF_HDROP").toString("ucs2");
                const encoded = encodeURI(res).split('%00');

                for (let i = encoded.length - 1; i >= 0; i--)
                {
                    encoded[i] = decodeURI(encoded[i]);
                    if (fs.existsSync(encoded[i]) === false)
                    {
                        encoded.splice(i, 1);
                    }
                }

                console.log(encoded);
            }
        });*/

        $(window).on('dragenter', (e) => {this.show(); });
        $('#filedrop').on('click', (e) => {this.hide(); });
        $('#filedrop').on('dragleave', (e) => {this.hide(); });
        $('#filedrop').on('dragenter', (e) => {this.allowDrag(e); });
        $('#filedrop').on('dragover', (e) => {this.allowDrag(e); });

        document.getElementById('filedrop').addEventListener('drop', (e) => {
            // $('#filedrop').on('drop', (e) => {

            e.preventDefault();
            setTimeout(() => {
                $('#filedrop').removeClass('show')
            }, 1000);

            // console.log(e.dataTransfer.getData('html'));
            // console.log(e.dataTransfer.getData('text'));
            // console.log(e.dataTransfer.getData('text/html'));

            const droppedHTML = e.dataTransfer.getData("text/html");
            const dropContext = $('<div>').append(droppedHTML);
            const imgURL      = $(dropContext).find("img").attr('src');

            console.log(droppedHTML);
            console.log(this.process_pinterestPost(droppedHTML));
            console.log(imgURL);
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

    allowDrag(e)
    {
        if (true)
        {  // Test that the item being dragged is a valid one
            e.originalEvent.dataTransfer.dropEffect = 'copy';
            e.preventDefault();
        }
    }

    process_pinterestPost(droppedHTML)
    {
        const srcSet = $('<div>').append(droppedHTML).find("img").attr('srcset');

        if (srcSet !== undefined)
        {
            let srcOriginal = srcSet.split(', ');
            srcOriginal     = srcOriginal[srcOriginal.length - 1];
            return srcOriginal.split(' ')[0];
        }

        // return $('<div>').append(droppedHTML).find("img").attr('src');
    }

}