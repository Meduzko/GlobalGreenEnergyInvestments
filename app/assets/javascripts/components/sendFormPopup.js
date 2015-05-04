define(['jquery', 'components/popup'], function ($, popup) {

    return compSupport.extend(popup, {
        init: function (domId, config) {
            this.url = config.url;
            this.messageBox = '.message-box';
            popup.init.apply(this, arguments);
        },

        showMessage: function (message, messageType) {
            this.domId.find(this.messageBox).html('<div class="' + messageType + '-msg">' + message + '</div>');
        },

        sendForm: function () {
            var thisComp = this;
            var form = this.domId.find('form');
            var formData = form.serialize();

            if (form.valid()) {

                $.ajax({
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                    },
                    method: "POST",
                    url: this.url,
                    data: formData
                })
                    .done(function (data) {
                        if (data.status === 'errors') {
                            thisComp.showMessage(data.errors, 'errors');
                        } else {
                            thisComp.hide();
                            window.location.href = data.redirect_to;
                        }
                    })
                    .fail(function (data) {
                        thisComp.showMessage(data.responseText, 'errors');
                    });
            }
        }

    })

});
