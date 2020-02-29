class Tag
{
	_name;
	_active;
	_activeAsFilter;
	
	_tagSelector;
	
	constructor(name)
	{
		this.name           = name;
		this.active         = false;
		this.activeAsFilter = false;
		
		this.tagSelector = this.getTagSelector(this.name);
	}
	
	
	get activeAsFilter() { return this._activeAsFilter; }
	
	set activeAsFilter(value) { this._activeAsFilter = value; }
	
	set tagSelector(value) { this._tagSelector = value; }
	
	get tagSelector() { return this.getTagSelector(this.name); }
	
	// get tagSelector() { return this._tagSelector; }
	
	get name() { return this._name; }
	
	set name(value) { this._name = value; }
	
	get active() { return this._active; }
	
	set active(bool) { this._active = bool; }
	
	
	toggleActive(asFilter)
	{
		this.activeAsFilter = asFilter;
		this.setActive(!this.active);
	}
	
	setActive(value)
	{
		this.active = value;
		this.deployActive(this.active);
	}
	
	deployActive(value)
	{
		if (this.activeAsFilter)
			this.tagSelector.classList.add('item-content-filter-active');
		
		if (value)
		{
			this.tagSelector.classList.add('item-content-active');
		}
		else
		{
			this.tagSelector.classList.remove('item-content-active', 'item-content-filter-active');
		}
	}
	
	getTagSelector(name)
	{
		const children = $('#tags').children();
		
		for (let i = 0; i < children.length; i++)
		{
			if (children[i].childNodes[0].textContent === name)
			{
				return $('#tags').children()[i].childNodes[0];
			}
		}
	}
	
	
}

module.exports = Tag;
