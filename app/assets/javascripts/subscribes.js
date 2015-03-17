/*$(function () {

    $('#subscribe').click(function (e) {

        e.preventDefault();
        $('.updating-layer').show();

        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
            },
            complete: function () {
                $('.updating-layer').hide();
            },
            method: "POST",
            url: "/subscribes.json",
            data: $('#subscribeForm').serialize()
        })
            .done(function (data) {
                if (data.status === 'error'){
                    $('.message-box').html('<div class="error-msg">' + data.messages + '</div>');
                } else {
                    $('.message-box').html('<div class="success-msg">' + data.messages + '</div>');
                }
            })
            .fail(function (data) {
                $('.message-box').html('<div class="error-msg">' + data.messages + '</div>');
            });
    });

});*/
