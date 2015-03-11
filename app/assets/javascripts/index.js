/**
 *
 * Initialize sliders
 */
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

