

define(['jquery'], function ($) {

    return {
        init: function (domId, config) {
            $('#' + domId + ' .menu-control').click(function () {
                $(this).next().slideDown(300);
            });
        }
    }

});
