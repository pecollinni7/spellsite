const Path        = require('path');
const DataService = require('./DataService');
const settings    = require('./Settings');

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

    get html() { return this._html; }

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
    //
    // get tags() { return Data.getTagsForFileName(this.name) }
    //
    // set tags(value)
    // {
    //     this._tags = value;
    //     Data.setTagsForFileName(this.name, this._tags);
    // }
    get tags() { return DataService.getActiveTagsForFileName(this.name) }

    set tags(value)
    {
        this._tags = value;
        DataService.setTagsForFileName(this.name, this._tags);
    }

    getActiveTags()
    {
        const res  = [];
        const tags = this.tags;

        for (const tag in tags)
        {
            if (tags[tag] === 1)
            {
                res.push(tag);
            }
        }

        return res;
    }

    updateTag(tagName, tagValue)
    {
        // Data.updateTag(this.name, tagName, tagValue);
        this.tags = Data.getTagsForFileName(this.name);
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

        //Managing the DataService.selectedItems here...
        if (this.isSelected === true)
        {
            if (DataService.selectedItems.includes(this) === false)
            {
                DataService.selectedItems.push(this);
            }
        }
        else
        {
            // for (let i = DataService.selectedItems.length - 1; i >= 0; i--)
            // {
            //     if (DataService.selectedItems[i].name === this.name)
            //     {
            //         DataService.selectedItems.splice(i, 1);
            //     }
            // }
            //
            const selectedItemIndex = DataService.selectedItems.indexOf(this);
            if (selectedItemIndex > -1)
            {
                DataService.selectedItems.splice(selectedItemIndex, 1);
            }
        }

        this.deploySelection(this.isSelected);
    }

    selectIt()
    {
        this.isSelected = true;
        this.deploySelection(this.isSelected);
    }

    containsTag(searchTag)
    {
        return this.tags.includes(searchTag);
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
                res = "<img " + //TODO: add isSelected in the class list
                    "class='image " + (this.isSelected ? "selected" : "") + "' src='" + this.src + "'" + " onmousedown='site.handleItemClick(this, event)' " + " oncontextmenu='site.openContextMenu(event, event.clientX - 5, event.clientY - 5)' " + " ondblclick='site.handleItemDoubleClick(this)' " + "data-fileName='" + this.name + "'" + ">";
                return res;

            case ".mp4":
                res = "<video class='videoInsert " + (this.isSelected ? "selected" : "") + " ' " + "onmousedown='site.handleItemClick(this, event)' " + "ondblclick='site.handleItemDoubleClick(this)' " + "oncontextmenu='site.openContextMenu(event, event.clientX - 5, event.clientY - 5)' " + "data-fileName='" + this.name + "' " + "autoplay loop muted>" + "<source src=" + this.src + " type='video/mp4'>" + "</video>";

                // console.log(res);
                return res;

            //TODO: filepath cannot contain blank spaces, bcs its recognized as class
            //TODO: return html block for unsupported fileType
            default:
                return res;
        }
    }
}

module.exports = Item;