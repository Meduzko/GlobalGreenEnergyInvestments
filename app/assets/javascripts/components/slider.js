define(['jquery', 'swiper'], function ($, Swiper) {

    'use strict';

    return {
        init: function (domId, config) {

            var thisComp = this;
            this.domId = domId;

            var slider = new Swiper('#' + domId, {
                // Optional parameters
                autoplay: 7000,
                loop: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                onInit: function () {
                    thisComp.lazyLoad();
                }
            });
        },

        lazyLoad: function () {

            var thisComp = this;

            $('#' + this.domId + ' .swiper-slide').each(function () {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    $(this).css('background-image', "");
                    $('#' + thisComp.domId).addClass('mobile-slider').css('background-image', "url(" + $('.first-slide').attr('data-src') + ")");
                } else {
                    $(this).css('background-image', "url(" + $(this).attr('data-src') + ")");
                }
            });

        }

    }

});

