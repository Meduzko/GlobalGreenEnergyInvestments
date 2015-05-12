
define(['jquery'], function ($) {

    return {

        ESC_CODE: 27,

        init: function (domId, config) {
            var thisComp = this;
            this.domId = $('#' + domId);
            this.popupRef = $('.popup');

            $(document).keyup(function(e) {
                if (e.keyCode == thisComp.ESC_CODE) {
                    thisComp.hide();
                }
            });
        },

        show: function () {
            this.popupRef.fadeOut(200);
            this.domId.fadeIn(200);
        },

        hide: function () {
            this.domId.fadeOut(100);
        }

    }

});
