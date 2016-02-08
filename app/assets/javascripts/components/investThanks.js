define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {

            var thisComp = this;

            this.domId = $('#' + domId);
            this.confirmTotalAmount = $('#' + domId + ' .confirmTotalAmount');
            this.participationsThanksPopup = '#participationsThanksPopup';

            compSupport.onCompEvent(this.participationsThanksPopup, 'showed', function () {
                thisComp.confirmTotalAmount.text(thisComp.getTotalAmount());
            });

        },

        getTotalAmount: function () {
            return localStorage.getItem('confirmTotalAmount');
        }
    }

});
