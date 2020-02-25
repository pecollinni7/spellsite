const remote     = require('electron').remote;
const tags       = require('../js/tags');
const files      = require('../js/files');
const generator  = require('../js/generator');
const navigation = require('../js/navigation');



window.addEventListener('DOMContentLoaded', () => {

	tags.getGrid().layout();

	generator.generateContent();

});

$('#tags').on('tagClick', function (e, tagElement, tagName) {
	handleTagClick(tagElement, tagName);
});

function reloadPage() {
	remote.getCurrentWindow().reload();
}

function clearContentSelection() {
	const items = document.getElementById('content').childNodes;
	if (items.length > 1) {
		for (let i = 0; i < items.length; i++) {
			if (items[i].classList !== undefined)
				if (items[i].classList.contains('selected'))
					items[i].classList.remove('selected');
		}
	}

	tags.clearTagSelection();
}


function handleItemClick(item)
{

	clearItemSelection();
	item.classList.toggle("selected");

	tags.clearTagSelection();

	const selection = getSelectedItemFileNames();
	if (selection)
	{
		for (let i = 0; i < selection.length; i++)
		{
			tags.displayTags(getTagsForSource(selection[i]));
		}
	}
}

function clearItemSelection()
{
	$('#content').children().each(function (index, element) {
		$(element).removeClass('selected');
	});
}


function handleTagClick(tagElement, tagName) {
	const selection = getSelectedItemFileNames();

	if (selection !== undefined && selection.length > 0) {
		tagElement.classList.toggle('item-content-active');

		selection.forEach(item => {
			if (tags.isTagActive(tagElement)) {
				setTagForSource(item, tagName);
			} else {
				removeTagForSource(item, tagName);
			}
		});

		// server.actionPerformed();

	} else {
		tagElement.classList.toggle('item-content-filter-active');
		generator.generateContent(tags.getActiveFilterTags());
	}
}



function getSelectedItemFileNames() {
	const items       = document.getElementById('content').childNodes;
	let selectedItems = [];

	for (let i = 0; i < items.length; i++) {
		if (items[i].classList === undefined) continue;
		if (items[i].classList.contains('selected')) {
			selectedItems.push(items[i].getAttribute('data-filename'));
		}
	}
	return selectedItems;
}

function getTagsForSource(srcFileName) {
	var tagsOn = [];

	const jsonFile = files.getDataFile()[srcFileName].tags;
	for (var tagName in jsonFile) {
		if (jsonFile.hasOwnProperty(tagName)) {
			if (jsonFile[tagName] === 1) {
				tagsOn.push(tagName);
			}
		}
	}

	return tagsOn;
}


function setTagForSource(srcFileName, tagName) {
	var jsonData = files.getDataFile();
	if (jsonData.hasOwnProperty(srcFileName) === false)
		jsonData[srcFileName] = {};

	if (jsonData[srcFileName].hasOwnProperty('tags') === false)
		jsonData[srcFileName].tags = {};

	jsonData[srcFileName].tags[tagName] = 1;
	files.setDataFile(jsonData);


	var jsonPatch = files.getPatchFile();
	if (jsonPatch.hasOwnProperty(srcFileName) === false)
		jsonPatch[srcFileName] = {};

	if (jsonPatch[srcFileName].hasOwnProperty('tags') === false)
		jsonPatch[srcFileName].tags = {};

	jsonPatch[srcFileName].tags[tagName] = 1;
	files.setPatchFile(jsonPatch);
}


function removeTagForSource(srcFileName, tagName) {

	var jsonData = files.getDataFile();
	if (jsonData.hasOwnProperty(srcFileName) === false)
		jsonData[srcFileName] = {};

	if (jsonData[srcFileName].hasOwnProperty('tags') === false)
		jsonData[srcFileName].tags = {};

	// if (jsonData[srcFileName].tags.hasOwnProperty(tagName) !== false)
	// 	delete jsonData[srcFileName].tags[tagName];

	jsonData[srcFileName].tags[tagName] = 0;
	files.setDataFile(jsonData);


	var jsonPatch = files.getPatchFile();
	if (jsonPatch.hasOwnProperty(srcFileName) === false)
		jsonPatch[srcFileName] = {};

	if (jsonPatch[srcFileName].hasOwnProperty('tags') === false)
		jsonPatch[srcFileName].tags = {};

	// if (jsonPatch[srcFileName].tags.hasOwnProperty(tagName) !== false)
	// 	delete jsonPatch[srcFileName].tags[tagName];

	jsonPatch[srcFileName].tags[tagName] = 0;
	files.setPatchFile(jsonPatch);

}