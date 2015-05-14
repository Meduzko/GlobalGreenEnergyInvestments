define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.domId = $('#' + domId);
            this.updatingLayer = '.updating-layer';
            this.mesageBox = '.message-box';

            this.domId.find('form').on('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })

        },

        showUpdatingLayer: function () {
            this.domId.find(this.updatingLayer).show();
        },

        hideUpdatingLayer: function () {
            this.domId.find(this.updatingLayer).hide();
        },

        showMessage: function (message, messageType) {
            this.domId.find(this.mesageBox).html('<div class="' + messageType + '-msg">' + message + '</div>');
        },

        sendForm: function () {
            var thisComp = this;
            var form = this.domId.find('form');
            var formData = form.serialize();

            if (form.valid()) {
                thisComp.showUpdatingLayer();

                $.ajax({
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                    },
                    complete: function () {
                        thisComp.hideUpdatingLayer();
                    },
                    method: "POST",
                    url: "/subscribes.json",
                    data: formData
                })
                    .done(function (data) {
                        if (data.status === 'error') {
                            thisComp.showMessage(data.messages, 'error');
                        } else {
                            thisComp.showMessage(data.messages, 'success');
                        }
                    })
                    .fail(function (data) {
                        thisComp.showMessage(data.messages, 'error');
                    });
            }
        }

    }

});

