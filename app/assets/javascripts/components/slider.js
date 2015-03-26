
define(['jquery', 'swiper'], function ($, Swiper) {

    return {
        init: function (domId, config) {
            new Swiper ('#' + domId, {
                // Optional parameters
                autoplay: 7000,
                loop: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }
    }

});

