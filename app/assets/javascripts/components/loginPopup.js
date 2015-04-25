
define(['jquery', 'components/popup'], function ($, popup) {

    return compSupport.extend(popup, {
        init: function (domId, config) {
            popup.init.apply(this, arguments);

            $('#' + domId).find('form').on('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
        },


        sendForm: function () {
            console.log(123);
        }

    })

});
