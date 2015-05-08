define(['jquery', 'components/popup'], function ($, popup) {

    return compSupport.extend(popup, {
        init: function (domId, config) {
            this.url = config.url;
            this.needRedirect = config.needRedirect;
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
                            thisComp.showMessage(data.errors, 'error');
                        } else {
                            //thisComp.hide();
                            thisComp.showMessage(data.success, 'success');
                            if (thisComp.needRedirect) {
                                window.location.href = data.redirect_to;
                            }
                        }
                    })
                    .fail(function (data) {
                        console.log(data);
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
