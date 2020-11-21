const DataService = require('./DataService');
const TagObject   = require('./TagObject');
const MuuriGrid   = require('./MuuriGrid');

class TagsController
{

    _muuriGrid;
    _tags;
    // _site;

    //TODO: eventHandlers needs this. move it somewhere else.
    get mainGrid() { return this.muuriGrid.grid; }

    get muuriGrid() { return this._muuriGrid; }
    set muuriGrid(value) { this._muuriGrid = value; }
    get tags() { return this._tags; }
    set tags(value) { this._tags = value; }
    // get site() { return this._site; }
    // set site(value) { this._site = value; }

    get hasActiveTags()
    {
        for (let i = 0; i < this.tags.length; i++)
            if (this.tags[i].active || this.tags[i].activeAsFilter)
                return true;

        return false;
    }

    get activeTags()
    {
        let res = [];

        for (let i = 0; i < this.tags.length; i++)
        {
            if (this.tags[i].active || this.tags[i].activeAsFilter)
            {
                res.push(this.tags[i].name);
            }
        }

        return res;

    }

    constructor()
    {
        this.muuriGrid = new MuuriGrid();
        this.tags      = [];

    }

    generate()
    {
        $('#tags').html('');
        const tagNames = DataService.tagsList;
        this.muuriGrid.generateGrid(tagNames);

        this.tags = [];
        tagNames.forEach(name => {
            this.createTagObject(name);
        });
    }

    createTagObject(tagName)
    {
        for (let i = 0; i < this.tags.length; i++)
        {
            if (this.tags[i].name === tagName)
            {
                console.log('Tag already exist');
                return;
            }
        }

        this.tags.push(new TagObject((tagName)));
    }

    removeTagObject(tagName)
    {
        for (let i = this.tags.length; i >= 0; i--)
        {
            if (this.tags[i].name === tagName)
            {
                this.tags.splice(i, 1);
                return;
            }
        }
    }

    updateTagObject(tagName)
    {

    }

    getTags(tagNames)
    {
        let res  = [];
        tagNames = [].concat(tagNames);

        this.tags.forEach(tag => {
            for (let i = 0; i < tagNames.length; i++)
            {
                if (tag.name === tagNames[i]) res.push(tag);
            }
        })

        return res;
    }

    toggleTag(tagName, asFilter = null)
    {
        const tag = this.getTags(tagName)[0];
        tag.toggle(asFilter);
    }

    displayTags(tagNames)
    {
        // tagNames = [].concat(tagNames);

        // tagNames.forEach(tagName => {
        //     this.displayTag(tagName);
        // })

        const tags = this.getTags(tagNames);

        tags.forEach(tag => {
            tag.displayTag();
        })
    }

    displaySelectedItemsActiveTags()
    {
        this.clearSelection();
        this.displayTags(this.getSelectedItemsActiveTagNames());
    }

    clearSelection()
    {
        this.tags.forEach(tag => {
            tag.active = false;
            tag.deploy();
        });
    }

    clearFilterSelection()
    {
        DataService.filterMode = false;
        DataService.filterModeTags = [];

        this.tags.forEach(tag => {
            tag.activeAsFilter = false;
            tag.deploy();
        });
    }

    getSelectedItemsActiveTagNames()
    {
        let res = [];

        DataService.selectedItems.forEach(item => {
            const itemTags = item.tags;

            itemTags.forEach(tag => {
                if (res.includes(tag) === false)
                {
                    res.push(tag);
                }
            })
        })

        return res;
    }

}

module.exports = TagsController;