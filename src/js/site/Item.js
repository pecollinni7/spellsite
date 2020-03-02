const mediaPath = require('./StorageFilePaths').path_media;
const Path      = require('path');
const Data      = require('./Data');

class Item
{
	_name;
	_ext;
	_src;
	_isSelected;
	_tags;
	_html;
	_itemSelector;

	constructor(name, allFilesTags)
	{
		this.name       = name;
		this.ext        = Path.extname(name);
		this.src        = mediaPath + '/' + name;
		this.isSelected = false;
		this.tags       = Data.getTagsForFileName(this.name);
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
		if (this._itemSelector === undefined)
			this._itemSelector = this.getItemSelector();

		return this._itemSelector;
	}

	get tags() { return Data.getTagsForFileName(this.name) }

	set tags(value)
	{
		this._tags = value;
		Data.setTagsForFileName(this.name, this._tags);
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
		Data.updateTag(this.name, tagName, tagValue);
		this.tags = Data.getTagsForFileName(this.name);
	}

	getItemSelector()
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

	deploySelection(value)
	{
		if (value)
		{
			this.itemSelector.classList.add('selected');
		} else
		{
			this.itemSelector.classList.remove('selected');
		}
	}

	toggleSelection()
	{
		this.isSelected = !this.isSelected;
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
				res = "<img class='image' src='" + this.src +
					"' onmousedown='site.handleItemClick(this)' data-fileName='" + this.name +
					"' ondblclick='site.handleItemDoubleClick(this)' data-fileName='" + this.name +
					"'>";
				return res;

			case ".mp4":
				res = "";
				res += "<video class='videoInsert' onclick='site.handleItemClick(this)' ondblclick='site.handleItemDoubleClick(this)' data-fileName='" + this.name + "' autoplay loop muted>";
				res += "<source src=" + this.src + " type='video/mp4'>";
				res += "</video>";

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
