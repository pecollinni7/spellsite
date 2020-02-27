const mediaPath = require('./StorageFilePaths').path_media;
const Path      = require('path');

class Item
{
	_name;
	_ext;
	_src;
	_isSelected;
	_tags;
	_html;

	constructor(name)
	{
		this._name       = name;
		this._ext        = Path.extname(name);
		this._src        = mediaPath + '/' + name;
		this._isSelected = false;
		this._tags       = [];
		this._html       = this.generateHtml(this.ext);
	}

	get name() {return this._name;}

	set name(value) {this._name = value;}

	get src() {return this._src;}

	set src(value) { this._src = value; }

	get isSelected() { return this._isSelected; }

	set isSelected(value) { this._isSelected = value; }

	get tags() { return this._tags; }

	set tags(value) { this._tags = value; }

	get ext() { return this._ext; }

	get html() { return this._html; }

	
	toggleSelection()
	{
		this.isSelected = !this.isSelected;
	}

	containsTag(searchTag)
	{
		return this._tags.includes(searchTag);
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
					"' onmousedown='handleItemClick(this)' data-fileName='" + this.name +
					"' ondblclick='handleItemDoubleClick(this)' data-fileName='" + this.name +
					"'>";
				return res;

			case ".mp4":
				res = "";
				res += "<video class='videoInsert' onclick='handleItemClick(this)' ondblclick='handleItemDoubleClick(this)' data-fileName='" + this.name + "' autoplay loop muted>";
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
