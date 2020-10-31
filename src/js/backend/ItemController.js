const StorageService = require('./StorageService');
const Path = require('path');

class ItemController
{
    _name;
    _ext;
    _src;
    _isSelected;
    _tags;
    _html;
    _itemSelector;

    constructor()
    {
        this.name       = name;
        this.ext        = Path.extname(name);
        this.src        = Settings.getSettings('path.media') + '/' + name;
        this.isSelected = false;
    }

    generateHtml(extension)
    {
        // const filePath = encodeURI(this.src);
        let res;

        switch (extension)
        {
            case ".gif":
            case ".jpg":
            case ".png":
                res = "<img " +
                    "class='image' src='" + this.src + "'" +
                    " onmousedown='site.handleItemClick(this, event)' " +
                    " oncontextmenu='site.openContextMenu(event, event.clientX - 5, event.clientY - 5)' " +
                    " ondblclick='site.handleItemDoubleClick(this)' " +
                    "data-fileName='" + this.name + "'" +
                    ">";
                return res;

            case ".mp4":
                res = "<video class='videoInsert' " +
                    "onmousedown='site.handleItemClick(this, event)' " +
                    "ondblclick='site.handleItemDoubleClick(this)' " +
                    "oncontextmenu='site.openContextMenu(event, event.clientX - 5, event.clientY - 5)' " +
                    "data-fileName='" + this.name + "' " +
                    "autoplay loop muted>" +
                    "<source src=" + this.src + " type='video/mp4'>" +
                    "</video>";

                // console.log(res);
                return res;

            //TODO: filepath cannot contain blank spaces, bcs its recognized as class
            //TODO: return html block for unsupported fileType
            default:
                return res;
        }
    }

}