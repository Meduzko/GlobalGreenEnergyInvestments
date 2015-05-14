define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {

            var canvas = $('#' + domId),
                context = canvas[0].getContext("2d"),
                percent = (2 * parseFloat(canvas[0].getAttribute("data-percentage"))) / 100;

            context.lineWidth = 3.0;
            context.strokeStyle = '#26d5ba';
            context.arc(46, 46, 44, 0.5 * Math.PI, (percent + 0.5) * Math.PI, false);
            context.stroke();

        }
    }

});

