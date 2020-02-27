const Tag   = require('./Tag');
const Muuri = require('muuri');

class Tags
{
	
	_tags;
	_mainGrid;
	
	_tagsSelector;
	
	get tags() { return this._tags; }
	
	get mainGrid() { return this._mainGrid; }
	
	set mainGrid(value) { this._mainGrid = value; }
	
	get tagsSelector() { return this._tagsSelector; }
	
	set tagsSelector(value) { this._tagsSelector = value; }
	
	
	constructor()
	{
		this._tags = [];
		this.tagsSelector = $('#tags');
	}
	
	addTag(tagName)
	{
		this.tags.push(new Tag((tagName)));
	}
	
	getActiveTagNames()
	{
		let res = [];
		
		this.tags.forEach(tag => {
			if (tag.active)
			{
				res.push(tag.name);
			}
		});
		
		return res;
	}
	
	displayTags()
	{
	
	}
	
	clearSelection()
	{
		this.tags.forEach(tag => {
			tag.active = false;
		});
		
		//you should move this under Tag class
		this.tagsSelector.childNodes.each(element => {
			element.childNodes[0].removeClass('item-content-active', 'item-content-filter-active');
		});
	}
	
	generateTags(tagNames)
	{
		this.createGrid();
		this.addItemsToGrid(this.mainGrid, tagNames);
	}
	
	
	createGrid()
	{
		
		this.mainGrid = new Muuri('.tags', {
			
			// items: '.item',
			dragEnabled   : true,
			dragContainer : document.body,
			// layoutOnResize: 50,
			justifyContent: 'center',
			layoutOnResize: false,
			layoutOnInit  : true,
			
			
			dragStartPredicate: (item, e) => {
				
				if (e.isFinal && e.distance < 2)
				{
					$("#tags").trigger("tagClick", [item._child, e.target.innerText]);
					return false;
				}
				
				if (e.deltaTime > 100)
				{
					return true;
				}
			},
			
			layout: {
				fillGaps   : false,
				horizontal : false,
				alignRight : false,
				alignBottom: false,
				rounding   : true
			}
		});
		
		this.mainGrid.on('releasestart', function (item, data) {
			// console.log(item);
			// console.log(data);
		});
		
		this.mainGrid.on('move', function () {
			// saveLayout(grid1);
		});
		
		// grid1.on('layoutEnd', function () {
		// setMarginSize();
		// });
		this.mainGrid.on('layoutStart', function () {
			// setMarginSize();
		});
		
	}
	
	addItemsToGrid(grid, tags)
	{
		const elements = this.createTagElement(tags);
		
		elements.forEach(el => {
			el.style.display = 'none';
		});
		
		grid.add(elements);
		grid.show(elements);
	}
	
	createTagElement(allTagTypes)
	{
		let res = [];
		
		allTagTypes.forEach(tag => {
			const id     = tag;
			const title  = tag;
			const width  = this.getCorrespondingWidthClass(this.displayTextWidth(tag));
			const height = 1;
			res.push(this.createItemElement(id, title, width));
		});
		
		return res;
	}
	
	createItemElement(id, title, width, height)
	{
		const el         = document.createElement('div');
		const classNames = 'item w' + width;
		
		el.innerHTML = '<div class="' + classNames + '" data-id="' + id + '" >' +
					   '<div class="item-content" >' + title + '</div>' +
					   // '<button type="button" onclick="tagClick();" class="item-content   waves-effect waves-light blue-grey darken-2 btn-small " >' + title + '</button>' +
					   '</div>';
		
		return el.firstChild;
	}
	
	displayTextWidth(text, font)
	{
		const myCanvas = this.displayTextWidth.canvas || (this.displayTextWidth.canvas = document.createElement("canvas"));
		const context  = myCanvas.getContext("2d");
		context.font   = "bold 17pt verdana";
		
		const metrics = context.measureText(text);
		return metrics.width;
		
		// return text.length * 14;
	}
	
	getCorrespondingWidthClass(width)
	{
		if (width <= 10) return 10;
		if (width >= 150) return 150;
		
		return Math.ceil(width / 10) * 10;
	}
}


module.exports = Tags;



