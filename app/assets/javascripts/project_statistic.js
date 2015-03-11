window.load = function () {
    var canvas = document.getElementsByClassName("canvas-statistic");

    for (var i = 0; i < canvas.length; i++) {
        var context = canvas[i].getContext("2d"),
            percent = (2 * parseFloat(canvas[i].getAttribute("data-percentage"))) / 100;

        context.lineWidth = 3.0;
        context.strokeStyle = '#26d5ba';
        context.arc(46, 46, 44, 0.5 * Math.PI, (percent + 0.5) * Math.PI, false);
        context.stroke();
    }

}();
