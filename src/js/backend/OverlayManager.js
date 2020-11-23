const NewTagOverlay   = require('./NewTagOverlay');
const ItemViewOverlay = require('./ItemViewOverlay');
const DropZoneOverlay = require('./DropZoneOverlay');
const SettingsOverlay = require('./SettingsOverlay');
const DataService     = require('./DataService');
const Data            = require('./Data');
const TagOverlay      = require('./TagOverlay');

module.exports = class OverlayManager
{
    _site;

    _newTagOverlay;
    _itemViewOverlay;
    _dropZoneOverlay;
    _settingsOverlay;
    _activeOverlay;

    _overlays;

    static NEW_TAG_OVERLAY   = 'newTagOverlay';
    static ITEM_VIEW_OVERLAY = 'itemViewOverlay';
    static DROP_ZONE_OVERLAY = 'dropZoneOverlay';
    static SETTINGS_OVERLAY  = 'settingsOverlay';

    get site() { return this._site; }
    set site(value) { this._site = value; }
    get newTagOverlay() { return this._newTagOverlay; }
    set newTagOverlay(value) { this._newTagOverlay = value; }
    get itemViewOverlay() { return this._itemViewOverlay; }
    set itemViewOverlay(value) { this._itemViewOverlay = value; }
    get dropZoneOverlay() { return this._dropZoneOverlay; }
    set dropZoneOverlay(value) { this._dropZoneOverlay = value; }
    get settingsOverlay() { return this._settingsOverlay; }
    set settingsOverlay(value) { this._settingsOverlay = value; }
    get overlays() { return this._overlays; }
    set overlays(value) { this._overlays = value; }
    get activeOverlay() {return this._activeOverlay}
    set activeOverlay(value) { this._activeOverlay = value; }

    constructor(site)
    {
        this.site = site;

        this.overlays = {
            'newTagOverlay'  : new NewTagOverlay(this),
            'itemViewOverlay': new ItemViewOverlay(this),
            'dropZoneOverlay': new DropZoneOverlay(this),
            'settingsOverlay': new SettingsOverlay(this),
        }
    }

    showOverlay(overlayType, param1=null)
    {
        if (this.activeOverlay)
            this.activeOverlay.hide();

        this.activeOverlay = this.getOverlay(overlayType);
        this.activeOverlay.show(param1);
    }

    hideOverlay()
    {
        if (this.activeOverlay)
            this.activeOverlay.hide();
    }

    getOverlay(overlayType)
    {
        return this.overlays[overlayType];
    }

}

