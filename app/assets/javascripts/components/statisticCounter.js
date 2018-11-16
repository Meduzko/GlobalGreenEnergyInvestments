define(['jquery'], function ($) {

    'use strict';

    return {

        DEFAULT_INTERVAL: 1000,

        init: function (domId, config) {

            this.savedStatistic = $('#' + domId + ' .savedStatistic');
            this.config = config;
            this.updateStat();
        },

        updateStat: function () {
            /*
            var xhr = new XMLHttpRequest();
            var url = "url";
            var data = JSON.stringify({
                name: "Виктор",
                surname: "Цой"
              });
            xhr.open("POST", '/url', true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    console.log(json.name + ", " + json.surname);
                }
            };
           
            var userObj = {
                "userName": "vlad"
            }
            
            var url = "/projects";
            
            $.ajax({
                url: url,
                method: "post",
                data: userObj,
                error: function(message) {
                    console.log(message);
                },
                success: function(data) {
                    console.log(data);
                }
            });
             */

            var thisComp = this;
            var step = parseFloat(thisComp.config.stepValue).toFixed(2);
            var interval = thisComp.config.updateInterval || thisComp.DEFAULT_INTERVAL;

            setInterval(function () {
                thisComp.savedStatistic.text((parseFloat(parseFloat(thisComp.savedStatistic.text()).toFixed(2)) + parseFloat(step)).toFixed(2));
            }, interval)
        }
    }

});
