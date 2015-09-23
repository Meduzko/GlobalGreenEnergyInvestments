define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.domId = $('#' + domId);
            this.count = $('#' + domId + ' .count');
            this.amount = $('#' + domId + ' .amount');
            this.totalAmount = $('#' + domId + ' .totalAmount');
            this.totalAmountNeeded = parseInt(config.totalAmountNeeded, 10);
            this.totalAmountInvested = parseInt(config.totalAmountInvested, 10);
            this.setCount();
            this.setMaxCounts();
            this.setTotalAmount();
        },

        calculateTotal: function (countField) {
            var counter = parseFloat($(countField).val());
            if (typeof(counter) === 'number') {
                this.totalAmount.text(Math.abs(parseFloat(this.amount.text()) * counter).toFixed(2));
                this.setCount();
                this.setTotalAmount();
            }

        },

        checkValid: function () {
            if (this.count.hasClass('error')) {
                return false;
            } else {
                compSupport.callFunc('#participationsConfirmationPopup', 'show')
            }
        },

        setCount: function () {
            localStorage.setItem('confirmCount', parseFloat(this.count.val()));
        },

        setMaxCounts: function () {
            console.log(this.totalAmountNeeded);
            console.log(parseInt(this.amount.text(), 10));
            this.count.prop('max', Math.floor((this.totalAmountNeeded - this.totalAmountInvested) / parseInt(this.amount.text(), 10)));
        },

        setTotalAmount: function () {
            localStorage.setItem('confirmTotalAmount', parseFloat(this.totalAmount.text()).toFixed(2));
        }
    }

});

