define(['jquery', 'jquery.responsiveTabs'], function ($) {

    'use strict';

    return {
        init: function (domId) {
            $('#' + domId).responsiveTabs({
                active: 0,
                animation: "slide",
                rotate: false,
                collapsible: false,
                duration: 300
            }).show();
        }
    }

});
