define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.domId = $('#' + domId);
        },


        resetState: function () {
            $('.mobileMenu span').removeClass('icon-cancel');
            $('.mobileMenu ul').slideUp(100);
        },

        handleMenu: function (control) {
            if ($(control).hasClass('icon-cancel')){
                this.resetState();
            } else {
                this.resetState();
                this.domId.find('.menu-control').addClass('icon-cancel');
                this.domId.find('ul').slideDown(300);
            }


        }

    }

});
