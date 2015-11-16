define(['jquery'], function ($) {

    'use strict';

    return {

        DEFAULT_INTERVAL: 1000,

        init: function (domId, config) {

            this.savedStatistic = $('#' + domId + ' .savedStatistic');
            this.config = config;
            this.updateStat();
        },

        updateStat: function () {

            var thisComp = this;
            var step = parseFloat(thisComp.config.stepValue).toFixed(2);
            var interval = thisComp.config.updateInterval || thisComp.DEFAULT_INTERVAL;

            setInterval(function () {
                thisComp.savedStatistic.text((parseFloat(parseFloat(thisComp.savedStatistic.text()).toFixed(2)) + parseFloat(step)).toFixed(2));
            }, interval)
        }
    }

});
