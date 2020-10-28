const Item = require('./Item');
const Data        = require('./Data');
let SelectionTemp = [];

class Content
{
	// _methods = [];
	_items;
	_html;
	_selection = [];
	
	_contentSelector;
	
	constructor(fileNames, fileTags)
	{
		this._items = [];
		this.html = '';
		
		this.contentSelector = $('#content');
		
		
		this.generateItems(fileNames, fileTags);
		this.generateHtml();
	}
	
	get items() { return this._items; }
	
	get html() { return this._html; }
	
	set html(value) { this._html = value; }
	
	set contentSelector(value) { this._contentSelector = value; }
	
	get contentSelector() { return this._contentSelector; }
	
	generateItems(fileNames, fileTags)
	{
		fileNames.forEach(fileName => {
			this.items.push(new Item(fileName, fileTags));
		})
	}

	updateTagsForSelectedItems(tagName, tagValue)
	{
		const selectedItems = this.getSelectedItems();

		selectedItems.forEach(selectedItem => {
			selectedItem.updateTag(tagName, tagValue);
		})
	}

	removeSelectedItems()
	{
		const selectedItems = this.getSelectedItems();
		const selectedItemNames = this.getSelectedItemNames();

		Data.removeItems(selectedItemNames);
	}
	
	getSelectedItems()
	{
		let res = [];
		
		this.items.forEach(item => {
			if (item.isSelected)
			{
				res.push(item);
			}
		});
		
		return res;
	};

	holdSelection()
	{
		SelectionTemp = this.getSelectedItemNames();
	}

	restoreSelection()
	{
		if (SelectionTemp === null) return;

		SelectionTemp.forEach(itemName => {
			const item = this.getItemByName(itemName);

			if (item)
				item.selectIt();
		});
	}
	
	getItemByName(itemName)
	{
		for (let i = 0; i < this.items.length; i++)
		{
			if (this.items[i].name === itemName)
			{
				return this.items[i];
			}
		}
	}

	getItemsByName(itemNames)
	{
		let res = [];

		for (let i = 0; i < this.items.length; i++)
		{
			for (let j = 0; j < itemNames.length; j++)
			{
				if (this.items[i].name === itemNames[j])
				{
					res.push(this.items[i]);
				}
			}
		}

		return res;
	}


	selectItemsByName(itemNames)
	{
		// if (itemNames === undefined || itemNames.length === 0)
		// {
		// 	return;
		// }

		for (let i = 0; i < itemNames.length; i++)
		{
			for (let j = 0; j < this.items.length; j++)
			{
				if (this.items[j].name === itemNames[i])
				{
					this.items[j].toggleSelection();
				}
			}
		}
	}

	getSelectedItemsTags()
	{
		let res = [];
		const selectedItems = this.getSelectedItems();


		selectedItems.forEach(selectedItem => {
			const selectedItemActiveTags = selectedItem.getActiveTags();


			selectedItemActiveTags.forEach(tagName => {
				if (res.includes(tagName) === false)
				{
					res.push(tagName);
				}
			});

			// for (const tag in selectedItem.tags)
			// {
			// 	if (selectedItem.tags[tag] === 1)
			// 	{
			// 		res.push(tag);
			// 	}
			// }
		});

		return res;
	}
	
	getSelectedItemNames()
	{
		let res = [];

		if (this.items.length === 0)
		{
			return [];
		}
		
		this.items.forEach(item => {
			if (item.isSelected)
			{
				res.push(item.name);
			}
		});
		
		return res;
	};
	
	clearSelection()
	{
		this.items.forEach(item => {
			item.isSelected = false;
		});
		
		$('#content').children().each(function (index, element) {
			$(element).removeClass('selected');
		});
	};
	
	generateHtml()
	{
		this.html = "";
		
		this.items.forEach(item => {
			this.html += item.html + '\n';
		})
	}
}


module.exports = Content;
