module.exports = class OverlayBase
{
    _site;
    _selector;

    get site() {return this._site;}
    get selector() { return this._selector; }
    set selector(value) { this._selector = value; }

    constructor(site)
    {
        this._site = site;
    }

    show() {};
    hide() {};
}