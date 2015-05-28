define(['jquery', 'jquery.responsiveTabs'], function ($) {

    'use strict';

    return {
        init: function (domId) {

            var isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

            var tabs = $('#' + domId).responsiveTabs({
                active: 0,
                //animation: "slide",
                scrollToAccordion: isMobile,
                setHash: true,
                rotate: false,
                collapsible: false,
                duration: 500
            }).show();

            tabs.on('tabs-activate', function () {
                compSupport.callFunc('#editProfileForm', 'checkIfPrefilledAreValid');
            });

        }
    }

});
