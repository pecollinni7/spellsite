const Data                             = require('./data/Data');
const DataService                      = require('./data/DataService');
const DataServiceEvents                = require('./data/DataServiceEvents');
const {spawnSync}                      = require('child_process');
const {clipboard, ipcRenderer, remote} = require('electron');
const path                             = require('path');
const Settings                         = require('./Settings');

const NotificationManager = require('./NotificationManager');

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

        $('#navigation').on('hide.bs.collapse', () => {
            $('#content').css('margin-top', 0);
        });

        $('#navigation').on('show.bs.collapse', () => {
            $('#content').css('margin-top', $('#navigation').height() + 30);
        });

        $('#navigation').on('shown.bs.collapse', () => {
            // grid1.layout();
            this.site.tagsController.mainGrid.layout();
        });

        $(window).on('resize', () => {
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(() => {
                if ($('#navigation').hasClass('inactive') === false)
                {
                    this.site.tagsController.mainGrid.layout();
                }
            }, 200);
        });

        $('#tags').on('tagClick', function (e, tagElement, tagName) {
            site.handleTagClick(tagElement.innerText);
        });

        $(document).on('keydown', e => {

            this.ctrlKey = e.ctrlKey;

            switch (e.keyCode)
            {
                case 67:
                    //copy selection files to clipboard
                    let paths = [];
                    for (let i = 0; i < Data.selectedItemNames.length; i++)
                        paths.push(Settings.getMediaPathForFileName(Data.selectedItemNames[i]));

                    ipcRenderer.send("send-to-clipboard", paths);
                    NotificationManager.addNotification("Copied " + paths.length + (paths.length > 1 ? ' files.' : ' file.'), '', true);
                    break;

                case 37:
                    this.site.callPreviousPage();
                    break;	//left
                case 39:
                    this.site.callNextPage();
                    break;		//right
                case 27:
                    this.site.clearSelection();
                    break;		//escape
            }
        });

        $(document).on('keyup', e => {
            this.ctrlKey = e.ctrlKey;
        });

        $(document).on(DataServiceEvents.CONTENT_UPDATE, () => {
            this.site.contentController.regenerate();
            this.site.displaySelectedItemsActiveTags();
        });

        $(document).on(DataServiceEvents.NEW_DATA_FILE, () => {

            this.site.updateDataFileVersionLabel();

            this.site.tagsController.regenerate();
            this.site.contentController.regenerate();
            this.site.displaySelectedItemsActiveTags();
            //todo update the content for filter mode
        });


        //TODO: combine all the mouse events in the project
        $(document).on('mousedown', e => {
            const element = $(e.target);

            if (element.hasClass('navigation') ||
                element.hasClass('pagination') ||
                element.hasClass('content') ||
                element.hasClass('html') ||
                element.hasClass('tags'))
            {
                this.site.clearSelection();
            }
        });

        let clicked = false, clickY, clickYStart;
        $(document).on({
            'mousedown' : (e) => {
                Data.mouseDown = true;

                if (e.which === 3)
                {
                    clicked     = true;
                    clickY      = e.pageY;
                    clickYStart = e.clientY;
                }




            }, 'mouseup': (e) => {
                Data.mouseDown = false;
                clicked        = false;
                $('html').css('cursor', 'auto');
                if (clickYStart === e.clientY)
                {
                    site.openContextMenu(e, e.clientX - 5, e.clientY - 5);
                }
            }
        });

    }

}

module.exports = EventHandlers;
