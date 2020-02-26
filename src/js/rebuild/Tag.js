class Tag
{
	_name;
	_active = false;

	constructor() {}


	get name()
	{
		return this._name;
	}

	set name(value)
	{
		this._name = value;
	}

	get active ()
	{
		return this._active;
	}

	set active (bool)
	{
		this._active = bool;
	}
}

module.exports = Tag;