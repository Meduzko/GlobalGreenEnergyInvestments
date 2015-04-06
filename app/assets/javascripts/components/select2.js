
define(['jquery', 'select2'], function ($) {

    return {
        init: function (domId, config) {
            $('#' + domId + ' select').each(function () {
                $(this).select2();
            })
        }
    }

});


