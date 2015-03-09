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


var nsOptions = {
    sliderId: "ninjaSlider",
    effect: "slide",
    autoAdvance: true,
    pauseOnHover: true,
    pauseTime: 5000,
    speed: 500,
    startSlide: 0,
    aspectRatio: "1550:683",
    circular: true,
    touchCircular: true,
    mobileNav: false,
    before: null,
    after: null
};

var nsOptions2 = {
    sliderId: "ninjaProjectsSlider",
    effect: "slide",
    autoAdvance: true,
    pauseOnHover: true,
    pauseTime: 5000,
    speed: 500,
    startSlide: 0,
    aspectRatio: "1600:730",
    circular: true,
    touchCircular: true,
    mobileNav: false,
    before: null,
    after: null
};


var nslider = new NinjaSlider(nsOptions);
var nslider2 = new NinjaSlider(nsOptions2);

