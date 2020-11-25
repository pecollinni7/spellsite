const OverlayBase = require('./OverlayBase');
const DataService = require("../data/DataService");

module.exports = class NewTagOverlay extends OverlayBase
{
    get inputText() { return $('#addTagInputName').val(); }

    constructor(overlayManager)
    {
        super(overlayManager);
        super.selector = $('#addTag');
    }

    init()
    {
        super.init();
    }

    show()
    {
        this.overlayContainerDiv.addClass('show');
        this.overlayContainerDiv.css('visibility', 'visible');

        this.selector.addClass('show');
        this.selector.css('visibility', 'visible');

        $('#navigation').removeClass('faded');
    }

    hide()
    {
        this.selector.on("webkitTransitionEnd transitionend", () => {
            if (this.selector.hasClass('show') === false)
            {
                this.selector.css('visibility', 'hidden');
                // $('#addTag').empty();
                this.selector.off("webkitTransitionEnd transitionend");
            }
        });

        this.selector.removeClass('show');
        this.overlayContainerDiv.removeClass('show');
        this.overlayContainerDiv.css('visibility', 'hidden');

    }

    confirm()
    {
        if (this.tagExistsInTagTypes() === false && this.inputText.length > 0)
        {
            this.site.tagsController.addTagsToGrid(this.inputText);
            DataService.addNewTag(this.inputText);

            this.hide();

            // this.site.server.actionPerformed();
        }
    }

    handleKeyPress()
    {
        $('#addTagInputName').removeClass('error');
        $('#errorText').hide();

        if (this.tagExistsInTagTypes())
        {
            $('#addTagInputName').addClass('error');
            $('#errorText').show();
        }
    }

    tagExistsInTagTypes()
    {
        const tagTypes = DataService.tagsList;

        for (let i = 0; i < tagTypes.length; i++)
            if (tagTypes[i] === this.inputText)
                return true;

        return false;
    }

}