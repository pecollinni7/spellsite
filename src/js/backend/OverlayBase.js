module.exports = class OverlayBase
{
    _site;
    _overlayManager;
    _selector;
    _overlayContainerDiv;

    get site() {return this._site;}
    get overlayManager() {return this._overlayManager;}
    get selector() { return this._selector; }
    set selector(value) { this._selector = value; }
    get overlayContainerDiv() { return this._overlayContainerDiv; }

    constructor(overlayManager)
    {
        this._site                = overlayManager.site;
        this._overlayManager      = overlayManager;
        this._overlayContainerDiv = $('#Overlay');
    }

    show() {};
    hide() {};
}