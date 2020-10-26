const Tag   = require('./Tag');
const Muuri = require('muuri');
const Data  = require('./Data');

class Tags
{
	
	_tags;
	_mainGrid;
	_currentTagName;
	_tagsSelector;


	get currentTagName()
	{
		return this._currentTagName;
	}

	set currentTagName(value)
	{
		this._currentTagName = value;
	}

	set tags(value) { this._tags = value; }
	
	get tags() { return this._tags; }
	
	get mainGrid() { return this._mainGrid; }
	
	set mainGrid(value) { this._mainGrid = value; }
	
	get tagsSelector() { return this._tagsSelector; }
	
	set tagsSelector(value) { this._tagsSelector = value; }
	
	
	constructor()
	{
		this.tags         = [];
		this.tagsSelector = $('#tags');
	}
	
	addTag(tagName)
	{
		this.tags.push(new Tag((tagName)));
	}

	removeTag(tagName)
	{
		for (let i = this.tags.length-1; i >= 0; i--)
		{
			if (this.tags[i].name === tagName)
			{
				this.tags.splice(i, 1);
				Data.removeTag(tagName);
				break;
			}
		}
	}
	
	activeTags()
	{
		let res = [];
		
		this.tags.forEach(tag => {
			
			if (tag.active || tag.activeAsFilter)
			{
				res.push(tag.name);
			}
		});
		
		return res;
	}
	
	getActiveTagNames()
	{
		let res = [];
		
		this.tags.forEach(tag => {
			
			if (tag.active || tag.activeAsFilter)
			{
				if (res.includes(tag.name) === false)
				{
					res.push(tag.name);
				}
			}
		});
		
		return res;
	}
	
	getTagValue(tagName)
	{
		for (let i = 0; i < this.tags.length; i++)
		{
			if (this.tags[i].name === tagName)
			{
				return this.tags[i].active;
			}
		}
	}
	
	getTagsByName(tagNames)
	{
		let res = [];
		
		for (let i = 0; i < this.tags.length; i++)
		{
			for (let j = 0; j < tagNames.length; j++)
			{
				if (this.tags[i].name === tagNames[j])
				{
					res.push(this.tags[i]);
				}
				
			}
		}
		
		return res;
	}
	
	getTagByName(tagName)
	{
		for (let i = 0; i < this.tags.length; i++)
		{
			if (this.tags[i].name === tagName)
			{
				return this.tags[i];
			}
		}
	}
	
	toggleTagByName(tagName, asFilter=false)
	{
		// const tags = this.getTagsByName([tagName]);
		// for (let i = 0; i < tags.length; i++)
		// {
		// 	tags[i].toggleActive(asFilter);
		// }
		
		const tag = this.getTagByName(tagName);
		tag.toggleActive(asFilter);
		
		
	}
	
	displayTagsByName(tagNames)
	{
		// this.clearSelection();
		this.clearNormalTags();
		
		const tags = this.getTagsByName(tagNames);
		
		tags.forEach(tag => {
			tag.setActive(true);
		})
	}
	
	clearNormalTags()
	{
		this.tags.forEach(tag => {
			tag.active =  false;
			tag.deploy();
		});
	}
	
	clearFilterTags()
	{
		this.tags.forEach(tag => {
			tag.activeAsFilter = false;
			tag.deploy();
		});
	}
	
	clearSelection()
	{
		this.tags.forEach(tag => {
			tag.active = tag.activeAsFilter = false;
			tag.deploy();
		});
		
		
		//you should move this under Tag class
		// this.tagsSelector.children().each(element => {
		// 	element.childNodes[0].removeClass('item-content-active', 'item-content-filter-active');
		// });
	}
	
	generateTags(tagNames)
	{
		this.tags     = [];
		this.mainGrid = null;
		$('#tags').html('');
		
		this.createGrid();
		this.addItemsToGrid(this.mainGrid, tagNames);
		
		tagNames.forEach(name => {
			this.addTag(name);
		});
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
			$('#content').css('margin-top', $('#navigation').height() + 30);
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



	addTagToGrid(tagName)
	{
		this.addTag(tagName);
		this.addItemsToGrid(this.mainGrid, [tagName]);

		//save the data file
		Data.addNewTag(tagName);
		
		
	}

	removeItemsFromGrid(tagName)
	{

		const gridItems = (this.mainGrid.getItems());

		for (let i = 0; i < gridItems.length; i++)
		{
			const currentTagText = gridItems[i]._child.innerText;
			if (currentTagText === tagName)
			{
				this.mainGrid.remove(i, {removeElements: true});
				this.removeTag(tagName);

				break;
			}
		}


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



