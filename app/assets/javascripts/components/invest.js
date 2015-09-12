define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.domId = $('#' + domId);
            this.count = $('#' + domId + ' .count');
            this.amount = $('#' + domId + ' .amount');
            this.totalAmount = $('#' + domId + ' .totalAmount');
            this.setCount();
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

        setCount: function () {
            localStorage.setItem('confirmCount', parseFloat(this.count.val()));
        },

        setTotalAmount: function () {
            localStorage.setItem('confirmTotalAmount', parseFloat(this.totalAmount.text()).toFixed(2));
        }
    }

});

