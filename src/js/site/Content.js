const Item = require('./Item');

class Content
{
	// _methods = [];
	_items;
	_html;
	
	_contentSelector;
	
	constructor(fileNames, fileTags)
	{
		this._items = [];
		
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

	getSelectedItemsTags()
	{
		let res = [];

		this.getSelectedItems().forEach(selectedItem => {

			for (const tag in selectedItem.tags)
			{
				if (selectedItem.tags[tag] === 1)
				{
					res.push(tag);
				}
			}
		});



		return res;
	}
	
	getSelectedItemNames()
	{
		let res = [];
		
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
			this.html += item.html;
		})
	}
}


module.exports = Content;
