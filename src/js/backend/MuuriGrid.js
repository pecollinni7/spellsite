const Utilities   = require('./Utilities');
const Muuri       = require('muuri');

class MuuriGrid
{
    _grid;

    get grid()          { return this._grid     }
    set grid(value)     { this._grid = value;   }

    constructor()
    {
    }

    generateGrid(tagNames)
    {
        this.createGrid();
        this.addItemsToGrid(tagNames);
    }

    createGrid()
    {

        this.grid = new Muuri('.tags', {

            dragEnabled: true, dragContainer: document.body, justifyContent: 'center', layoutOnResize: false, layoutOnInit: true,

            dragStartPredicate: (item, e) => {

                if (e.isFinal && e.distance < 2) {
                    $("#tags").trigger("tagClick", [item._child, e.target.innerText]);
                    return false;
                }

                if (e.deltaTime > 100) {
                    return true;
                }
            },

            layout: {
                fillGaps: false, horizontal: false, alignRight: false, alignBottom: false, rounding: true
            }

        });

        this.grid.on('dragReleaseStart', () => {
            // this.saveGridLayoutOrder();
        });

        this.grid.on('move', function () {
            // saveLayout(grid1);
        });
        this.grid.on('layoutStart', function () {
            $('#content').css('margin-top', $('#navigation').height() + 30);
        });

    }

    addItemsToGrid(tags)
    {
        const elements = this.createTagElement(tags);

        elements.forEach(el => {
            el.style.display = 'none';
        });

        this.grid.add(elements);
        this.grid.show(elements);
    }

    createTagElement(allTagTypes)
    {
        let res = [];

        allTagTypes.forEach(tag => {
            res.push(this.createItemElement(tag, tag, Utilities.getCorrespondingWidthClass(Utilities.displayTextWidth(tag))));
        });

        return res;
    }

    createItemElement(id, title, width, height)
    {
        const el         = document.createElement('div');
        const classNames = 'item w' + width;

        el.innerHTML = '<div class="' + classNames + '" data-id="' + id + '" >' + '<div class="item-content" >' + title + '</div>' + '</div>';

        return el.firstChild;
    }
}

module.exports = MuuriGrid;



