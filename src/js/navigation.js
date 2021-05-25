


// $('#mainmenu').on('mouseleave', function () {
//     $('#mainmenu').toggleClass('show');
// });

// $(window).on("scroll", function (event) {
//     const scroll = this.scrollY;
//     if (!$('#overlay').hasClass('show'))
//     {
//         if (scroll > $('#navigation').height())
//         {
//             $('#navigation').addClass('faded');
//         }
//         else
//         {
//             $('#navigation').removeClass('faded');
//         }
//     }
// });

// $(window).on('resize', function () {
//     clearTimeout(window.resizedFinished);
//     window.resizedFinished = setTimeout(function () {
//         if ($('#navigation').hasClass('inactive') === false) {
//             // grid1.layout();
//         }
//     }, 200);
// });




//TODO move all this crap to EventHandlers

function setDropdownPos()
{
    const dropdown = $('#mainmenu');
    dropdown.css({top: 30, left: 0, position: 'fixed'});
    dropdown.toggleClass('show');

    //TODO: it needs to disappear when clicked off container

    // dropdown.on('mouseleave mousedown', () => {
    //     dropdown.removeClass('show');
    // });


}

function toggleNavigation(btn)
{
    if ($('#navigation').hasClass('collapsing') === true) {
        return;
    }

    changeNavButtonIcon(btn);
    $('#navigation').collapse("toggle");
    // $('#navigation').toggleClass("toggle");
}

function changeNavButtonIcon(btn)
{
    if ($('#navigation').hasClass('inactive')) {
        $('#navigation').removeClass('inactive');
        btn.innerHTML = '&#xE70E;';

    } else {
        $('#navigation').addClass('inactive');
        btn.innerHTML = '&#xE70D;';

    }
}

function setMarginSize(offset = 0)
{
    $('#content').css('margin-top', $('#navigation').height() + 30);
}

module.exports = {
  setDropdownPos,
  toggleNavigation,
  changeNavButtonIcon,
  setMarginSize
};

