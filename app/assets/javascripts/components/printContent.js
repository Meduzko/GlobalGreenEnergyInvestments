define(['jquery'], function ($) {

    'use strict';

    return {
        init: function (domId, config) {
            this.contentForPrint = '#' + domId + ' .content-for-print';
        },

        print: function () {
            var printContents = $(this.contentForPrint).html();

            //console.log(this.contentForPrint);

            //console.log(printContents);

            var originalContents = document.body.innerHTML;
            //document.body.innerHTML = printContents;
            //window.print();
            //document.body.innerHTML = originalContents;
        }



    }

});

