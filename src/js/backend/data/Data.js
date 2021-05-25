class Data
{
    static _currentPageIndex     = 0;
    static _filterMode           = false;
    static _draggingOwnElement   = false;
    static _filterModeTags       = [];
    static _currentPageItemNames = [];
    static _selectedItemNames    = [];
    static _tagNameList          = [];
    static _mouseDown            = false;
    static _currentTagName;
    static _currentItemName;

    static get currentTagName() { return this._currentTagName; }
    static set currentTagName(value) { this._currentTagName = value; }
    static get filterMode() { return this._filterMode; }
    static get selectedItemNames() { return this._selectedItemNames; }
    static get currentPageIndex() { return this._currentPageIndex; }
    static get filterModeTags() { return this._filterModeTags; }
    static get currentPageItemNames() { return this._currentPageItemNames; }
    static set filterMode(value) { this._filterMode = value; }
    static set selectedItemNames(value) { this._selectedItemNames = value; }
    static set currentPageIndex(value) { this._currentPageIndex = value; }
    static set filterModeTags(value) { this._filterModeTags = value; }
    static set currentPageItemNames(value) { this._currentPageItemNames = value; }
    static get tagNameList() { return this._tagNameList; }
    static set tagNameList(value) { this._tagNameList = value; }
    static get mouseDown() { return this._mouseDown; }
    static get mouseUp() { return !this.mouseDown; }
    static set mouseDown(value) { this._mouseDown = value; }
    static get draggingOwnElement() { return this._draggingOwnElement; }
    static set draggingOwnElement(value) { this._draggingOwnElement = value; }
    static get isSelectionEmpty() {return this.selectedItemNames.length === 0;}
    static get currentItemName() { return this._currentItemName; }
    static set currentItemName(value) { this._currentItemName = value; }

    constructor() { }

    static isItemSelected(itemName)
    {
        return this.selectedItemNames.includes(itemName);
    }

}

module.exports = Data;