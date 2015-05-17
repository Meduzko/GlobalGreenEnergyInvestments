define(['jquery', 'jquery.responsiveTabs'], function ($) {

    'use strict';

    return {
        init: function (domId) {
            var tabs = $('#' + domId).responsiveTabs({
                active: 0,
                animation: "slide",
                scrollToAccordion: true,
                setHash: true,
                rotate: false,
                collapsible: false,
                duration: 300
            }).show();

            tabs.on('tabs-activate', function () {
                compSupport.callFunc('#editProfileForm', 'checkIfPrefilledAreValid');
            });

        }
    }

});
