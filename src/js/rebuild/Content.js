const Item = require('./Items/Item');
const path_media = "";

class Content
{
	// _methods = [];
	_items;

	constructor(fileNames)
	{
		this._items = [];
		this.generateItems(fileNames);
	}

	generateItems(fileNames)
	{
		fileNames.forEach(fileName => {
			this.addNewItem(fileName);
		})
	}

	addNewItem(name)
	{
		this._items.push(new Item(name));
	}



	getSelectedItems()
	{
		let res = [];
		this._items.forEach(item => {

			if (item.selected) {
				res.push(item);
			}
		});

		return res;
	};

	getSelectedItemNames()
	{
		let res = [];

		this._items.forEach(item => {
			if (item.selected) {
				res.push(item.name);
			}
		});

		return res;
	};

	clearSelection()
	{
		this._items.forEach(item => {
			item.selected = false;
		})
	};
}


module.exports = Content;
