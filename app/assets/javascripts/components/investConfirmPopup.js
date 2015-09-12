define(['jquery', 'components/sendFormPopup'], function ($, sendFormPopup) {

    'use strict';

    return compSupport.extend(sendFormPopup, {
        init: function (domId, config) {

            var thisComp = this;

            this.domId = $('#' + domId);
            this.confirmCount = $('#' + domId + ' .confirmCount');
            this.confirmCountField = $('#' + domId + ' #confirmCountField');
            this.confirmTotalAmount = $('#' + domId + ' .confirmTotalAmount');
            this.confirmTotalAmountField = $('#' + domId + ' #confirmTotalAmountField');
            this.participationsConfirmationPopup = '#participationsConfirmationPopup';

            sendFormPopup.init.apply(this, arguments);

            compSupport.onCompEvent(this.participationsConfirmationPopup, 'showed', function () {

                var count = thisComp.getCount();
                var amount = thisComp.getTotalAmount();

                thisComp.confirmCount.text(count);
                thisComp.confirmCountField.val(count);
                thisComp.confirmTotalAmount.text(amount);
                thisComp.confirmTotalAmountField.val(amount);
            });

        },

        getCount: function () {
            return localStorage.getItem('confirmCount');
        },

        getTotalAmount: function () {
            return localStorage.getItem('confirmTotalAmount');
        }
    })

});
