
define(['jquery', 'jquery.responsiveTabs'], function ($) {

    return {
        init: function (domId) {
            $('#' + domId).responsiveTabs({
                active: 0,
                disabled: [2],
                animation: "slide"
            });
        }
    }

});
