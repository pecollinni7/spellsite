class Data
{
    static _currentPageIndex     = 0;
    static _filterMode           = false;
    static _filterModeTags       = [];
    static _currentPageItemNames = [];
    static _selectedItemNames = [];
    static _tagNameList       = [];
    static _currentTagName;

    static get currentTagName()
    {
        return this._currentTagName;
    }
    static set currentTagName(value)
    {
        this._currentTagName = value;
    }
    static get filterMode()                 { return this._filterMode;              }
    static get selectedItemNames()          { return this._selectedItemNames;       }
    static get currentPageIndex()           { return this._currentPageIndex;        }
    static get filterModeTags()             { return this._filterModeTags;          }
    static get currentPageItemNames()       { return this._currentPageItemNames;    }
    static set filterMode(value)            { this._filterMode = value;             }
    static set selectedItemNames(value)     { this._selectedItemNames = value;      }
    static set currentPageIndex(value)      { this._currentPageIndex = value;       }
    static set filterModeTags(value)        { this._filterModeTags = value;         }
    static set currentPageItemNames(value)  { this._currentPageItemNames = value;   }
    static get tagNameList()                { return this._tagNameList;             }
    static set tagNameList(value)           { this._tagNameList = value;            }

    static get isSelectionEmpty() {return this.selectedItemNames.length === 0;}

    constructor() { }


}

module.exports = Data;