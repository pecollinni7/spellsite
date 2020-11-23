const DataService = require('./DataService');

class TagOverlay
{
    get selector() {return $('#addTag');}
    get inputText() {return $('#addTagInputName').val();}

    constructor() {}

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
        {
            if (tagTypes[i] === this.inputText)
            {
                return true;
            }
        }
    }

    toggleShowError()
    {
        if ($('#addTagInputName').hasClass('error'))
        {
            $('#addTagInputName').css('color', '#aa0000');
        }
        else
        {
            $('#addTagInputName').css('color', '#000000');
        }

        // console.log($('#addTagInputName').hasClass('error'));
        // $('#addTagInputName').addClass('error');
    }

    showTagOverlay()
    {
        this.selector.addClass('show');
        this.selector.css('visibility', 'visible');

    }

    setCaretPosition(ctrl, pos)
    {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }

    // Set the cursor position of the "#test-input" element to the end when the page loads

    removeTagOverlay()
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
    }
}

module.exports = TagOverlay;

