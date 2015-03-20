
define(['jquery'], function ($) {

    return {
        init: function (domId, config) {
            var thisComp = this;
            this.domId = $('#' + domId);

            $(document).keyup(function(e) {
                if (e.keyCode == 27) {
                    thisComp.hide();
                }
            });
        },

        show: function () {
            this.domId.fadeIn(200);
        },

        hide: function () {
            this.domId.fadeOut(100);
        }

    }

});
