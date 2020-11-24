const DataService = require('../data/DataService');

class TagObject
{
    _name;
    _active;
    _activeAsFilter;
    _tagSelector;

    constructor(name)
    {
        this.name           = name;
        this.active         = false;
        this.activeAsFilter = false;

        this.tagSelector = this.getTagSelector(this.name);
    }

    get activeAsFilter() { return this._activeAsFilter; }
    set activeAsFilter(value) { this._activeAsFilter = value; }
    set tagSelector(value) { this._tagSelector = value; }
    get tagSelector() { return this.getTagSelector(this.name); }
    // get tagSelector() { return this._tagSelector; }
    get name() { return this._name; }
    set name(value) { this._name = value; }
    get active() { return this._active; }
    set active(bool) { this._active = bool; }

    displayTag()
    {
        this.active = true;
        this.deploy();
    }

    toggle(asFilter=null)
    {
        if (asFilter)
        {
            this.activeAsFilter = !this.activeAsFilter;
        }
        else
        {
            this.active = !this.active;

            //add tag change to patch
            DataService.updateTagsForSelectedItems(this.name, this.active);

        }

        this.deploy();
    }

    deploy()
    {
        if (this.activeAsFilter)
        {
            $(this.tagSelector).addClass('item-content-filter-active');
        }
        else
        {
            $(this.tagSelector).removeClass('item-content-filter-active');
        }

        if (this.active)
        {
            $(this.tagSelector).addClass('item-content-active');
        }
        else
        {
            $(this.tagSelector).removeClass('item-content-active');
        }
    }

    setActive(value)
    {
        this.active = value;
        this.deploy();
    }

    deployActive(value)
    {
        if (value)
        {
            this.tagSelector.classList.add('item-content-active');

            if (this.activeAsFilter) this.tagSelector.classList.add('item-content-filter-active');
        }
        else
        {
            this.tagSelector.classList.remove('item-content-active', 'item-content-filter-active');
            this.activeAsFilter = false;
        }
    }

    getTagSelector(name)
    {
        const children = $('#tags').children();

        for (let i = 0; i < children.length; i++)
        {
            if (children[i].childNodes[0].textContent === name)
            {
                return $('#tags').children()[i].childNodes[0];
            }
        }
    }

}

module.exports = TagObject;
