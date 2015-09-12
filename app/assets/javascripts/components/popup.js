define(['jquery'], function ($) {

    'use strict';

    return {

        ESC_CODE: 27,

        init: function (domId, config) {
            var thisComp = this;
            this.domRef = '#' + domId;
            this.domId = $('#' + domId);
            this.popupRef = $('.popup');

            $(document).keyup(function(e) {
                if (e.keyCode == thisComp.ESC_CODE) {
                    thisComp.hide();
                }
            });

            this.domId.on('showed', function () {
                compSupport.triggerCompEvent(thisComp.domRef, 'showed');
            });

            this.domId.on('hided', function () {
                compSupport.triggerCompEvent(thisComp.domRef, 'hided');
            });
        },

        show: function () {
            this.domId.trigger('showed');
            this.popupRef.fadeOut(200);
            this.domId.fadeIn(200);
        },

        hide: function () {
            this.domId.trigger('hided');
            this.domId.fadeOut(100);
        }

    }

});
