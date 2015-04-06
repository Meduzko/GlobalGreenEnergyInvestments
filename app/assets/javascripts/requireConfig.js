(function (require, define) {

    var config = {

        baseUrl: "/javascripts",
        waitSeconds: 0, // No timeout (best for slow connection)

        // configuration for CSS plugin
        // see: https://github.com/guybedford/require-css
        map: {
            '*': {
                //'css': 'third_party/require_css/css.min'
            }
        },

        "paths": {
            "jquery": ["//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min", "vendors/jquery"],
            "jquery.validate": "vendors/jquery.validate",
            "swiper": "vendors/swiper",
            "jquery.responsiveTabs": "vendors/jquery.responsiveTabs",
            "select2": "vendors/select2"
        },

        "shim": {
            "jquery": {"exports": "jQuery"}
        }
    };


    // adding additional JS path (if file was not found or loading timeout)
    for (var index in config.paths) {
        if (config.paths.hasOwnProperty(index) && typeof config.paths[index] === 'string') {
            config.paths[index] = [config.paths[index], config.paths[index]];
        }
    }

    require.config(config);

})(require, define);
