define(['jquery', 'swiper'], function ($, Swiper) {

    'use strict';

    return {
        init: function (domId, config) {
            var slider = new Swiper('#' + domId, {
                // Optional parameters
                autoplay: 7000,
                loop: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true
            });


            /*setInterval(function () {

                $('#' + domId + ' .swiper-slide-next').css('background-image', $(this).attr('data-src'));
            }, 5000);

            $('#' + domId + ' .swiper-slide').each(function () {
                console.log($(this));
                $(this).prev('.swiper-slide-active').css('background-image', $(this).attr('data-src'));
            });


            slider.on('init', function (swiper) {
                console.log(swiper);
            });*/

            /*slider.on('slideChangeStart', function (swiper) {
                console.log(swiper);
            });*/

        }
    }

});

