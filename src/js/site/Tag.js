class Tag
{
	_name;
	_active;
	
	_tagSelector;
	
	constructor(name)
	{
		this.name   = name;
		this.active = false;
		
		this.tagSelector = $('#tags').childNodes;
	}
	
	
	get tagSelector() { return this._tagSelector; }
	
	set tagSelector(value) { this._tagSelector = value; }
	
	get name()
	{
		return this._name;
	}
	
	set name(value)
	{
		this._name = value;
	}
	
	get active()
	{
		return this._active;
	}
	
	set active(bool)
	{
		this._active = bool;
	}
}

module.exports = Tag;
