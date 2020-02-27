const Item = require('./Item');

class Content
{
	// _methods = [];
	_items;
	_html;
	
	_contentSelector;
	
	constructor(fileNames)
	{
		this._items = [];
		
		this.contentSelector = $('#content');
		
		
		this.generateItems(fileNames);
		this.generateHtml();
	}
	
	get items() { return this._items; }
	
	get html() { return this._html; }
	
	set html(value) { this._html = value; }
	
	set contentSelector(value) { this._contentSelector = value; }
	
	get contentSelector() { return this._contentSelector; }
	
	generateItems(fileNames)
	{
		fileNames.forEach(fileName => {
			this.items.push(new Item(fileName));
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
		this.items.forEach(item => {
			if (item.name === itemName)
			{
				return item;
			}
		});
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
