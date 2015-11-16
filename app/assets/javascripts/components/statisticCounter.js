define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.savedStatistic = $('#' + domId + ' .savedStatistic');
            this.config = config;
            this.updateStat();
        },

        updateStat: function () {

            var thisComp = this;
            var step = parseFloat(thisComp.config.stepValue).toFixed(2);

            setInterval(function () {
                thisComp.savedStatistic.text((parseFloat(parseFloat(thisComp.savedStatistic.text()).toFixed(2)) + parseFloat(step)).toFixed(2));
            }, thisComp.config.updateInterval)
        }
    }

});
