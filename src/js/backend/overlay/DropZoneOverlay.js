const Data                     = require('../data/Data');
const OverlayBase              = require('./OverlayBase');
const {clipboard, ipcRenderer} = require('electron');
// const clipboardy  = require('clipboardy');
// const ipcMain = require('electron').ipcMain;
const fs = require('fs');

const slash = require('slash');

const NotificationManager = require('../NotificationManager');
const path = require('path');



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

                if (e.originalEvent.dataTransfer.files.length > 0)
                {
                    let fileNames = [];
                    let filePaths = [];
                    const files = e.originalEvent.dataTransfer.files;

                    for (let i=0; i<files.length; i++)
                    {
                        fileNames.push('<br>' + files[i].name + '</>');
                        filePaths.push(files[i].path);
                    }

                    fileNames = fileNames.join(',');

                    const fileCount = e.originalEvent.dataTransfer.files.length;
                    const msg = "Dropped " + fileCount + (fileCount > 1 ? " files" : " file");
                    NotificationManager.addNotification(msg, fileNames, true);

                    $(document).trigger('uploadMedia', [files]);
                }
                else
                {
                    NotificationManager.addNotification("Dropped link.", '', true);

                    // $('#drop-content').html(`
                    //     <img src='"${  slash(filePaths[0].path)}"'>
                    // `);

                    const droppedHTML = e.originalEvent.dataTransfer.getData("text/html");
                    const dropContext = $('<div>').append(droppedHTML);
                    const imgURL      = $(dropContext).find("img").attr('src');

                    console.log(droppedHTML);
                    console.log(this.process_pinterestPost(droppedHTML));
                    console.log(imgURL);
                    // $('#drop-content').html("<img src=\'" + imgURL + "\'>");


                }
                this.hide();

            }
        });



        // document.getElementById('filedrop').addEventListener('drop', (e) => {

        // console.log('drop');
        // e.preventDefault();
        //
        // this.hide();

        // console.log(e.dataTransfer.getData('html'));
        // console.log(e.dataTransfer.getData('text'));
        // console.log(e.dataTransfer.getData('text/html'));

        // const droppedHTML = e.dataTransfer.getData("text/html");
        // const dropContext = $('<div>').append(droppedHTML);
        // const imgURL      = $(dropContext).find("img").attr('src');

        // console.log(droppedHTML);
        // console.log(this.process_pinterestPost(droppedHTML));
        // console.log(imgURL);
        // console.log(e.dataTransfer.files);

        // this.server.uploadMedia(e.dataTransfer.files);

        // for (let i = 0; i < e.originalEvent.dataTransfer.files.length; i++)
        // {
        // 	this.server.uploadMedia(e.originalEvent.dataTransfer.files.item(i));
        //
        // }
        // });

        $('#filedrop').on('webkitTransitionEnd transitionend', () => {
            if ($('#filedrop').hasClass('show') === false)
                $('#filedrop').css('visibility', 'hidden');
        });
    }

    // dragType(e)
    // {
    //     e.preventDefault();
    //     if (Data.draggingOwnElement)
    //     {
    //         e.originalEvent.dataTransfer.dropEffect = 'none';
    //     }
    //     else
    //     {
    //         e.originalEvent.dataTransfer.dropEffect = 'copy';
    //
    //     }
    //
    //     // this.show(e);
    // }

    generateHtmlForItem(itemPaths)
    {
        let res = [];

        for (let i = 0; i < itemPaths.length; i++){
            const path = (slash(itemPaths[i])).toString();
            console.log(path);
            // res.push("<img src=\'" + path + "\'>");
        }

        return res;
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