const Data        = require('../data/Data');
const OverlayBase = require('./OverlayBase');
// const {clipboard, ipcRenderer} = require('electron');
// const clipboardy  = require('clipboardy');
// const ipcMain = require('electron').ipcMain;
const fs = require('fs');

const slash = require('slash');

const NotificationManager = require('../NotificationManager');
const path                = require('path');

module.exports = class DropZoneOverlay extends OverlayBase
{
    get server() {return this.site.server;}

    constructor(overlayManager)
    {
        super(overlayManager);
        // super.selector = $('#filedrop');
    }

    init()
    {

        $(window).on('keydown', e => {
            if (e.ctrlKey && e.keyCode === 86)
            {
                e.stopPropagation();
                e.preventDefault();

                navigator.clipboard.readText().then(text => {

                    if (text)
                    {
                        // console.log('Pasted content: ', text);
                        NotificationManager.addNotification("Pasted link.", '', true);
                        //  TODO: maybe it needs to be in array
                        $(document).trigger('downloadLink', this.makeLinksObj(text));
                    }

                }).catch(err => {
                    console.error('Failed to read clipboard contents: ', err);
                });

            }
        });

        $(window).on({
            'dragenter': (e) => {
                e.preventDefault();
                if (e.originalEvent.dataTransfer.effectAllowed === 'all')
                    this.show();

            },
            'dragover' : (e) => {

                e.preventDefault();
                if (e.originalEvent.dataTransfer.effectAllowed === 'all')
                    e.originalEvent.dataTransfer.dropEffect = 'copy';
                else
                    e.originalEvent.dataTransfer.dropEffect = 'none';


            },
        });

        $('#filedrop').on({
            'dragover' : (e) => {

                e.preventDefault();
                if (e.originalEvent.dataTransfer.effectAllowed === 'all')
                    e.originalEvent.dataTransfer.dropEffect = 'copy';
                else
                    e.originalEvent.dataTransfer.dropEffect = 'none';


            },
            'dragleave': (e) => {
                e.preventDefault();
                this.hide();
            },
            'drop'     : (e) => {

                e.preventDefault();


                $('#content').addClass('shrink');


                if (e.originalEvent.dataTransfer.files.length > 0)
                {
                    let fileNames = [];
                    let filePaths = [];
                    const files   = e.originalEvent.dataTransfer.files;

                    for (let i = 0; i < files.length; i++)
                    {
                        fileNames.push('<br>' + files[i].name + '</>');
                        filePaths.push(files[i].path);
                    }

                    fileNames = fileNames.join(',');

                    const fileCount = e.originalEvent.dataTransfer.files.length;
                    const msg       = "Dropped " + fileCount + (fileCount > 1 ? " files" : " file");
                    NotificationManager.addNotification(msg, fileNames, true);

                    $(document).trigger('uploadMedia', [files]);
                }
                else
                {
                    NotificationManager.addNotification("Dropped link.", '', true);

                    const droppedText  = e.originalEvent.dataTransfer.getData("text");
                    const droppedHtml  = e.originalEvent.dataTransfer.getData("text/html");
                    const dropContext  = $('<div>').append(droppedHtml);
                    const srcAttribute = $(dropContext).find("img").attr('src');

                    /*
                     //stringify is done in the routes
                     const linksObj = {
                     droppedText : droppedText,
                     droppedHtml : droppedHtml,
                     srcAttribute: srcAttribute
                     };
                     */
                     console.log(this.makeLinksObj('', droppedText, droppedHtml, srcAttribute));

                     $(document).trigger('downloadLink', this.makeLinksObj('', droppedText, droppedHtml, srcAttribute));
                }
                this.hide();

            }
        });

        $('#filedrop').on('webkitTransitionEnd transitionend', () => {
            if ($('#filedrop').hasClass('show') === false)
            {
                $('#filedrop').css('visibility', 'hidden');
                $('#content').removeClass('shrink');
            }

        });
    }

    makeLinksObj(pastedWeblink = '', droppedText = '', droppedHtml = '', srcAttribute = '')
    {
        return {
            weblink     : pastedWeblink,
            droppedText : droppedText,
            droppedHtml : droppedHtml,
            srcAttribute: srcAttribute
        };
    }

    dragContainsFiles(event)
    {
        if (event.dataTransfer.types)
            for (let i = 0; i < event.dataTransfer.types.length; i++)
                if (event.dataTransfer.types[i] === "Files")
                    return true;

        return false;
    }

    show()
    {
        $('#filedrop').addClass('show');
        $('#filedrop').css('visibility', 'visible');

    }

    hide()
    {
        $('#filedrop').removeClass('show');
        // $('#filedrop').css('visibility', 'hidden');


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