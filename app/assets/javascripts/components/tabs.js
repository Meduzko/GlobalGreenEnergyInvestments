define(['jquery', 'jquery.responsiveTabs'], function ($) {

    return {
        init: function (domId) {
            $('#' + domId).responsiveTabs({
                active: 0,
                animation: "slide",
                setHash: true,
                duration: 300
            }).show();
        }
    }

});
