let name;
let src;
let selected = false;


function setSrc(newSrc)
{
	this.src = newSrc;
}

function getSrc()
{
	return this.src;
}

function setSelection(sel)
{
	this.selected = sel;
}

function getSelection()
{
	return this.selected;
}

function getTags()
{

}


module.exports = {
	setSelection,
	getSelection,
	getTags,
	setSrc,
	getSrc,
	
	
};
