define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.domId = $('#' + domId);
            this.count = $('#' + domId + ' .count');
            this.amount = $('#' + domId + ' .amount');
            this.totalAmount = $('#' + domId + ' .totalAmount');
            this.investCount = $('#' + domId + ' #investCount');
            this.totalAmountNeeded = parseInt(config.totalAmountNeeded, 10);
            this.totalAmountInvested = parseInt(config.totalAmountInvested, 10);
            this.amountToInvest = parseInt(config.amountToInvest, 10);
            this.interestPaid = parseInt(config.interestPaid, 10);
            this.projectId = config.projectId;
            this.mesageBox = '.message-box';

            this.setCount();
            this.setTotalAmount();
            this.calculateTotal(this.investCount);

            this.getParticipation();
        },

        getParticipation: function () {

            var thisComp = this;

            $.ajax({
                method: "GET",
                url: "/projects/" + this.projectId + "/avaible_participation.json"
            })
                .done(function (data) {
                    if (data.status === 'error') {
                        thisComp.showMessage(data.messages, 'error');
                    } else {
                        thisComp.setMaxCounts(data.avaible_participation);
                    }
                })
                .fail(function (data) {
                    thisComp.showMessage(data.messages, 'error');
                });
        },

        showMessage: function (message, messageType) {
            this.domId.find(this.mesageBox).html('<div class="' + messageType + '-msg">' + message + '</div>');
        },

        calculateTotal: function (countField) {
            var counter = parseFloat($(countField).val());
            if (typeof(counter) === 'number') {
                this.totalAmount.text(Math.abs(parseFloat(this.amountToInvest) * counter).toFixed(2));
                this.amount.text(Math.abs(parseFloat(this.interestPaid) * counter).toFixed(2));
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

        setMaxCounts: function (avaible_participation) {
            this.count.prop('max', avaible_participation);
        },

        setTotalAmount: function () {
            localStorage.setItem('confirmTotalAmount', parseFloat(this.totalAmount.text()).toFixed(2));
        }
    }

});

