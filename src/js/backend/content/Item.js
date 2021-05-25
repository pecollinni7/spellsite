const Path        = require('path');
const Data        = require('../data/Data');
const DataService = require('../data/DataService');
const settings    = require('../Settings');

class Item
{
    _name;
    _ext;
    _src;
    _isSelected;
    _tags;
    _html;
    _itemSelector;

    constructor(name)
    {
        this.name       = name;
        this.ext        = Path.extname(this.name);
        this.src        = settings.getMediaPathForFileName(this.name);
        this.isSelected = false;
        this.tags       = DataService.getTagsForFileName(this.name);
        this.html       = this.generateHtml(this.ext);
    }

    get name() {return this._name;}
    set name(value) {this._name = value;}
    get src() {return this._src;}
    set src(value) { this._src = value; }
    get isSelected() { return this._isSelected; }
    set isSelected(value) { this._isSelected = value; }
    set ext(value) { this._ext = value; }
    get ext() { return this._ext; }
    set html(value) { this._html = value; }
    get html() { return this.generateHtml(this.ext); }

    get itemSelector()
    {
        const c = $('#content').children();

        for (let i = 0; i < c.length; i++)
        {
            if ($(c[i]).attr('data-filename') === this.name)
            {
                return $('#content').children()[i];
            }
        }
    }

    get tags() { return DataService.getActiveTagsForFileName(this.name) }

    set tags(value)
    {
        this._tags = value;
        // DataService.setTagsForFileName(this.name, this._tags);
    }

    getActiveTags()
    {
        // const res  = [];
        // const tags = this.tags;
        //
        // for (const tag in tags)
        // {
        //     if (tags[tag] === 1)
        //     {
        //         res.push(tag);
        //     }
        // }
        //
        // return res;

        return DataService.getActiveTagsForFileName(this.name);
    }

    deploySelection(value)
    {
        if (value === true)
        {
            $(this.itemSelector).addClass('selected');
        }
        else
        {
            $(this.itemSelector).removeClass('selected');
        }
    }

    toggleSelection()
    {
        this.isSelected = !this.isSelected;
        this.deploySelection(this.isSelected);
    }

    select(bool = true)
    {
        this.isSelected = bool;

        if (this.isSelected === true)
        {
            if (Data.selectedItemNames.includes(this) === false)
                Data.selectedItemNames.push(this.name);
        }
        else
        {
            const selectedItemIndex = Data.selectedItemNames.indexOf(this.name);
            if (selectedItemIndex > -1)
                Data.selectedItemNames.splice(selectedItemIndex, 1);
        }

        this.deploySelection(this.isSelected);
    }

    containsTag(searchTag)
    {
        return this.tags.includes(searchTag);
    }

    generateHtml(extension)
    {
        let res;

        switch (extension)
        {
            case ".gif":
            case ".jpg":
            case ".png":
            case ".tiff":
            case ".tga":
            case ".bmp":
                res = "<img " + //TODO: add isSelected in the class list
                    "class='image " + this.htmlSelectedOrNot() +
                    "' src='" + this.src + "'" +
                    " onmouseup='site.handleItemClick(this, event)' " +
                    " oncontextmenu='site.openContextMenu(event, event.clientX - 5, event.clientY - 5)' " +
                    " ondblclick='site.handleItemDoubleClick(this)' " +
                    " draggable='true' " +
                    // " ondragover='site.handleItemOnDragOver(this, event);' " +
                    // " ondragend='site.handleItemOnDragEnd(this, event);' " +
                    " ondragstart='site.handleItemDragStart(this, event);' " +
                    " data-fileName='" + this.name + "'" + ">";
                return res;

            case ".mp4":
                res = "<video class='videoInsert " + this.htmlSelectedOrNot() + " ' " +
                    "onmouseup='site.handleItemClick(this, event)' " +
                    "ondblclick='site.handleItemDoubleClick(this)' " +
                    "oncontextmenu='site.openContextMenu(event, event.clientX - 5, event.clientY - 5)' " +
                    "draggable='true' " +
                    "ondragstart='site.handleItemDragStart(this, event);' " +
                    "data-fileName='" + this.name + "' " + "autoplay loop muted>" +
                    "<source src=" + this.src + " type='video/mp4'>" + "</video>";

                // console.log(res);
                return res;

            //TODO: filepath cannot contain blank spaces, bcs its recognized as class
            //TODO: return html block for unsupported fileType
            default:
                return res;
        }
    }

    htmlSelectedOrNot()
    {
        if (this.isSelected === true)
        {
            return 'selected';
        }
        else
        {
            return '';
        }
    }
}

module.exports = Item;
