const DataEvents = require('./DataEvents');
const StorageService = require('./StorageService');


class DataService
{
    _storageService;
    _test;

    constructor()
    {
        this._storageService = new StorageService();
        this._test = DataEvents.ITEMS_CHANGED;
        this._test = DataEvents.calculateSomething();
    }
    // WORK WITH MODULES THIS TIME
    // ALL OF IT!

    // if item is selected
    // if many items are selected
    // if tag filters is active
    // if tag filters and item selection active
    // if you are on the last page that's about to be deleted


    // nicer settings
    // maybe a database of some sort

    // dataFile update events: itemsChanged, itemsDataUpdated, itemsDownloaded, tagsUpdate, tagsLayoutUpdate,


    generateItem(); //with itemTags and other shit
    updateItem();

    //live generation
    //for lets say first 40 files
    generatePageContent();
    updatePageContent();


    // when new file arrives
    // pagination should be calculated based on the page items content
    generatePagination();
    updatePagination(); // easy. just generate the numbers based on the num of data



    generateTags();
    updateTags();
    updateTagsLayout();




}

module.exports = DataService;