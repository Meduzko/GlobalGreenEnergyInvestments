define(['jquery', 'components/popup'], function ($, popup) {

    'use strict';

    return compSupport.extend(popup, {

        ENTER_CODE: 13,

        init: function (domId, config) {
            var thisComp = this;
            this.url = config.url;
            this.needRedirect = config.needRedirect;
            this.messageBox = '.message-box';
            popup.init.apply(this, arguments);

            $('#' + domId).keyup(function (e) {
                if (e.keyCode == thisComp.ENTER_CODE) {
                    thisComp.sendForm();
                }
            });

        },

        showMessage: function (message, messageType) {
            this.domId.find(this.messageBox).html('<div class="' + messageType + '-msg">' + message + '</div>');
        },

        clearMessage: function () {
            this.domId.find(this.messageBox).html('');
        },

        showSpinner: function () {
            this.domId.find('button[type="button"]').append('<object class="spinner" data="../images/svg/spinner.svg" type="image/svg+xml"></object>');
        },

        hideSpinner: function () {
            this.domId.find('.spinner').remove();
        },

        sendForm: function () {
            var thisComp = this;
            var form = this.domId.find('form');
            var formData = form.serialize();

            this.clearMessage();

            if (form.valid()) {

                this.showSpinner();

                $.ajax({
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                    },
                    method: "POST",
                    url: this.url,
                    data: formData
                })
                    .done(function (data) {
                        thisComp.hideSpinner();
                        if (data.status === 'errors') {
                            thisComp.showMessage(data.errors, 'error');
                        } else {
                            thisComp.showMessage(data.success, 'success');
                            if (thisComp.needRedirect) {
                                window.location.href = data.redirect_to;
                            }
                        }
                    })
                    .fail(function (data) {
                        thisComp.hideSpinner();
                        if (data.status === 422) {
                            var parsedData = JSON.parse(data.responseText);
                            thisComp.showMessage(parsedData.errors, 'error');
                        } else {
                            thisComp.showMessage(data.responseText, 'error');
                        }
                    });
            }
        }

    })

});
