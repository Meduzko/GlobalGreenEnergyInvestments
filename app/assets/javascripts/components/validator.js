
define(['jquery', 'jquery.validate'], function ($) {

    return {
        init: function (domId, config) {
            $('#' + domId).validate();
        }
    }

});

