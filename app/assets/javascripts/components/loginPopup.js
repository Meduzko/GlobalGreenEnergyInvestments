define(['jquery', 'components/popup'], function ($, popup) {

    return compSupport.extend(popup, {
        init: function (domId, config) {
            popup.init.apply(this, arguments);
        },

        showMessage: function (message, messageType) {
            this.domId.find(this.mesageBox).html('<div class="' + messageType + '-msg">' + message + '</div>');
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
                    url: "/users/sign_in",
                    data: formData
                })
                    .done(function (data) {
                        if (data.status === 'error') {
                            thisComp.showMessage(data.messages, 'error');
                        } else {
                            thisComp.hide();
                        }
                    })
                    .fail(function (data) {
                        thisComp.showMessage(data.messages, 'error');
                    });
            }
        }

    })

});