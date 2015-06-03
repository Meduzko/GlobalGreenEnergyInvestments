define(['jquery'], function ($) {

    return {
        init: function (domId) {

            var video = $('#' + domId + ' video').get(0);

            $('.play-pause').on("click", function() {
                if (video.paused) {
                    video.play();
                    $('#' + domId).addClass("playing");
                } else {
                    video.pause();
                    $('#' + domId).removeClass("playing");
                }
            });

        }

    }

});

