let counter = 0;
let grid1;
let grid1AddButton;
let grid1RemoveButton;
const files = require('./files');

const fs = require("fs");
const Muuri = require('muuri');

document.addEventListener("DOMContentLoaded", function (e) {
    // grid1AddButton = document.querySelector('.grid-1 .add');
    // grid1RemoveButton = document.querySelector('.grid-1 .remove');
    createGrid();
    addItemsToGrid(grid1, getTagTypes());
});
// document.onload = () => {
// 	grid1AddButton.addEventListener('click', function () {
// 		addItemsToGrid(grid1, 5);
// 	});
//
// 	grid1RemoveButton.addEventListener('click', function () {
// 		removeItemsFromGrid(grid1, 5);
// 	});
// };
// Muuri.defaultOptions.dragSortPredicate.action = 'swap';
// Muuri.defaultOptions.showDuration = 400;

function getGrid() {
    return grid1;
}

function createGrid()
{
    grid1 = new Muuri('.tags', {
        // items: '.item',
        dragEnabled: true,
        dragContainer: document.body,
        // layoutOnResize: 50,
        justifyContent: 'center',
        layoutOnResize: false,
        layoutOnInit: true,
        // dragStartPredicate: {
        // 	distance: 0,
        // 	delay: 500,
        //
        // },

        dragStartPredicate: (item, e) => {
            if (e.isFinal && e.distance < 2) {
                // handleTagClick(item._child, e.target.innerText);
                $("#tags").trigger("tagClick", [item._child, e.target.innerText]);
                return false;
            }

            if (e.deltaTime > 100) {
                return true;
            }
        },


        layout: {
            fillGaps: false,
            horizontal: false,
            alignRight: false,
            alignBottom: false,
            rounding: true
        },

        // Classnames
        // containerClass: 'muuri',
        // itemClass: 'muuri-item',
        // itemVisibleClass: 'muuri-item-shown',
        // itemHiddenClass: 'muuri-item-hidden',
        // itemPositioningClass: 'muuri-item-positioning',
        // itemDraggingClass: 'muuri-item-dragging',
        // itemReleasingClass: 'muuri-item-releasing',
        // itemPlaceholderClass: 'muuri-item-placeholder'

        // dragSort: function() {
        // 	return [grid1, grid2];
        // }
    });


    grid1.on('releasestart', function (item, data) {
        // console.log(item);
        // console.log(data);
    });

    grid1.on('move', function () {
        // saveLayout(grid1);
    });

    // grid1.on('layoutEnd', function () {
    // setMarginSize();
    // });
    grid1.on('layoutStart', function () {
        // setMarginSize();
    });


}

function saveLayout()
{
    const items = grid1._items;
    let res = [];
    for (let i = 0; i < items.length; i++) {
        res.push(items[i]._child.textContent);
    }

    setTagTypes(res);
}


function createItemElement(id, title, width, height)
{
    const el = document.createElement('div');
    const classNames = 'item w' + width;
    // prettier-ignore
    el.innerHTML = '<div class="' + classNames + '" data-id="' + id + '" >' +
        '<div class="item-content" >' + title + '</div>' +
        // '<button type="button" onclick="tagClick();" class="item-content   waves-effect waves-light blue-grey darken-2 btn-small " >' + title + '</button>' +
        '</div>';

    return el.firstChild;
}

function tagClick()
{

    console.log('asdasdsa');
    // btn.classList.toggle('item-content-active');
}

// function createItemElements(amount)
// {
// 	var ret = [];
//
// 	for (let i = 0; i < amount; i++) {
// 		const id = ++counter;
// 		const title = id;
// 		const width = getRandomInt(1, 2); //calc width and ret css eq
// 		const height = 1;
// 		ret.push(createItemElement(id, title, height, width));
// 	}
//
// 	return ret;
// }

function createTagElement(allTagTypes)
{
    let res = [];

    for (let i = 0; i < allTagTypes.length; i++) {
        const tag = allTagTypes[i];
        // const id = ++counter;
        const id = tag;
        const title = tag;
        const width = getCorrespondingWidthClass(displayTextWidth(tag));
        const height = 1;
        res.push(createItemElement(id, title, width));
    }

    return res;
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function displayTextWidth(text, font)
{
    const myCanvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    const context = myCanvas.getContext("2d");
    context.font = "bold 17pt verdana";

    const metrics = context.measureText(text);
    return metrics.width;
}

function getCorrespondingWidthClass(width)
{
    if (width <= 10) {
        return 10;
    }
    if (width >= 150) {
        return 150;
    }
    return Math.ceil(width / 10) * 10;
}

function addItemsToGrid(grid, tags)
{
    const elements = createTagElement(tags);
    elements.forEach(function (el) {
        el.style.display = 'none';
    });
    grid.add(elements);
    grid.show(elements);
}

function removeItemsFromGrid(grid, amount)
{
    const items = grid.getItems();
    items.length = amount;
    grid.hide(items, {
        onFinish: function (hiddenItems) {
            grid.remove(hiddenItems, {removeElements: true});
        }
    });
}

function getTagTypes()
{
    let jsonData = require('../../storage/json/dataTagTypes.json');
    return jsonData['tagTypes'];
}

function setTagTypes(dataArray)
{
    let jsonData = require('../../storage/json/dataTagTypes.json');
    jsonData['tagTypes'] = dataArray;
    const newData = JSON.stringify(jsonData, null, 2);
    fs.writeFile('./dataTagTypes.json', newData, 'utf8', () => {
    });
}


















function addNewTag() {

}

function displayTags(tags) {
    const grid = document.getElementById('tags');
    const buttons = grid.childNodes;

    if (tags === undefined) {
        return;
    }

    for (let i = 0; i < buttons.length; i++) {
        tags.forEach(function (tag) {
            if (buttons[i].innerText === (tag)) {
                // console.log('tag = ' + tag);

                buttons[i].childNodes[0].classList.add('item-content-active');
            }
        });
    }
}

function clearTagSelection() {
    const buttons = document.getElementById('tags').childNodes;
    if (buttons !== undefined && buttons.length > 1) {

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].classList !== undefined) {
                buttons[i].childNodes[0].classList.remove('item-content-active');
                buttons[i].childNodes[0].classList.remove('item-content-filter-active');
            }
        }
    }
}

function isTagActive(tagElement)
{
    return tagElement.classList.contains('item-content-active');
}

function getActiveFilterTags()
{
    const buttons = $('#tags').children();
    let tagNames  = [];

    for (let i = 0; i < buttons.length; i++)
    {
        if (buttons[i].childNodes[0].classList.contains('item-content-filter-active'))
        {
            tagNames.push(buttons[i].childNodes[0].innerText);
        }
    }
    return tagNames;
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


module.exports = {
    addNewTag,
    displayTags,
    isTagActive,
    getActiveFilterTags,
    clearTagSelection,
    getGrid,
    setTagForSource,
    removeTagForSource,
    getTagsForSource
};
