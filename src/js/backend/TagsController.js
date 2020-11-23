const DataService = require('./DataService');
const Data        = require('./Data');
const TagObject   = require('./TagObject');
const MuuriGrid   = require('./MuuriGrid');
const Server      = require('./Server');

class TagsController
{

    _muuriGrid;
    _tags;

    //TODO: eventHandlers needs this. move it somewhere else.
    get mainGrid() { return this.muuriGrid.grid; }

    get muuriGrid() { return this._muuriGrid; }
    set muuriGrid(value) { this._muuriGrid = value; }
    get tags() { return this._tags; }
    set tags(value) { this._tags = value; }

    get tagsNameList()
    {
        let res = [];

        this.tags.forEach(tag => {
            res.push(tag.name);
        });

        return res;
    }

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
        Data.tagNameList = DataService.tagsList;
        this.muuriGrid.generateGrid(Data.tagNameList);
        this.tags = [];
        Data.tagNameList.forEach(name => {
            this.createTagObject(name);
        });
    }

    regenerate()
    {

        /*

         TODO: you will need to make this to work with filter mode as well. maybe regenerate the pages idk...

         */

        const newTags    = DataService.tagsList;
        let tagsToAdd    = [];
        let tagsToRemove = [];

        if (Data.tagNameList.length === newTags.length && Data.tagNameList.toString() === newTags.toString())
        {
            // tags are the same
            return false;
        }
        else
        {
            //items to remove
            for (let i = 0; i < Data.tagNameList.length; i++)
            {
                if (newTags.includes(Data.tagNameList[i]) === false)
                {
                    tagsToRemove.push(Data.tagNameList[i]);
                }

            }

            //items to add
            for (let i = 0; i < newTags.length; i++)
            {
                if (this.tags.find(item => item.name === newTags[i]) === undefined)
                {
                    tagsToAdd.push(newTags[i]);
                }
            }

            this.removeTagsFromGrid(tagsToRemove);
            this.addTagsToGrid(tagsToAdd);
        }

        Data.tagNameList = newTags;
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

    removeTagObjects(tagNames)
    {
        tagNames = [].concat(tagNames);

        for (let i = this.tags.length - 1; i >= 0; i--)
        {
            for (let j = 0; j < tagNames.length; j++)
            {
                if (this.tags[i].name === tagNames[j])
                {
                    this.tags.splice(i, 1);
                }
            }
        }
    }

    updateTagObject(tagName)
    {

    }

    addTags(tagNames)
    {
        tagNames.forEach(tagName => {
            this.addTagToGrid(tagName);
        })
    }

    removeTag(tagName)

    {
        this.removeTagsFromGrid(tagName);
        DataService.removeTag(tagName);
    }

    addTagsToGrid(tagNames)
    {
        tagNames = [].concat(tagNames);

        tagNames.forEach(tagName => {

            this.createTagObject(tagName);
            this.muuriGrid.addItemsToGrid(tagName);
        })

        // DataService.addNewTag(tagName);
    }

    removeTagsFromGrid(tagNames)
    {
        this.removeTagObjects(tagNames);
        this.muuriGrid.removeItemsFromGrid(tagNames);
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
        this.clearSelection();

        const tags = this.getTags(tagNames);

        tags.forEach(tag => {
            tag.displayTag();
        })
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
        Data.filterMode     = false;
        Data.filterModeTags = [];

        this.tags.forEach(tag => {
            tag.activeAsFilter = false;
            tag.deploy();
        });
    }

    // displaySelectedItemsActiveTags()
    // {
    //     this.clearSelection();
    //     this.displayTags(this.getSelectedItemsActiveTagNames()); //TODO: possible error here if the item does not exists anymore
    // }

    // getSelectedItemsActiveTagNames()
    // {
    //     let res = [];
    //
    //     Data.selectedItemNames.forEach(item => {
    //         const itemTags = item.tags;
    //
    //         itemTags.forEach(tag => {
    //             if (res.includes(tag) === false)
    //             {
    //                 res.push(tag);
    //             }
    //         })
    //     })
    //
    //     return res;
    // }

}

module.exports = TagsController;