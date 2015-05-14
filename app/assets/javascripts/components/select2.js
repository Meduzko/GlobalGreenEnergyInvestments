define(['jquery', 'select2'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            $('#' + domId + ' select').each(function () {
                $(this).select2();
            })
        }
    }

});


