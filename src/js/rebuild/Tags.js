const Tag = require('./Tag');

class Tags
{
	tags = [];

	constructor()
	{
		this.tags = [];
	}

	addTag ()
	{
		this.tags.push(new Tag());
	}

	get tags()
	{
		return this.tags;
	}

	get activeTagNames()
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


}

module.exports = Tags;



