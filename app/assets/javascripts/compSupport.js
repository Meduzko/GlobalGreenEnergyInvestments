var compSupport = (function () {

    // Private variables

    var components = [],
        componentsDebugInfo = [],
        currentCompId = 0,
        compIdAttrName = "data-component-id",
        jsCompAttrName = "data-jscomp",
        jsCompConfigAttrName = "data-jscomp-config",
        jsCompStylesAttrName = "data-jscomp-css",

    //Default path to folder with .css files
        jsCompStylesDefaultPath = "/stylesheets/";

    // Private methods

    function logInfo(message) {
        console.log(message);
    }

    function createNewObj(o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    }

    /**
     * Load css files that are listed in 'data-jscomp-css' attribute
     * @param styleAttrValue path to .css file, starts from 'jsCompStylesDefaultPath'
     */
    function loadCSSFiles(styleAttrValue) {
        var styles = styleAttrValue.replace(/\s/g, '').split(',');
        for (var i = 0; styles.length > i; i++) {
            require(['css!' + jsCompStylesDefaultPath + styles[i]]);
        }
    }

    /**
     * Add list of classes that create frome .css files names
     * @param stringToParse path to .css file, starts from 'jsCompStylesDefaultPath'
     * @returns {string} List of classes
     */
    function getClassNames(stringToParse) {
        //Parsing string with pathes to .css files and create list of classes from names of .css files
        return stringToParse.match(/((\w+)(?=,|$)+)/g).join(' ');
    }

    function loadComp(jsName, rootEl, config, styleAttrValue, debugInfo) {

        if (!jsName) throw "[compSupport] Error jsName is empty";

        var compLoadingTime = (window.performance && performance.now) ? performance.now() : 0,
            compId = currentCompId++,
            compRootElId = rootEl.getAttribute("id") || "jcomp-" + compId;

        // Check if component is already loaded to avoid duplicate loading
        if (rootEl.getAttribute(compIdAttrName) !== null) {
            return false;
        }

        rootEl.setAttribute('id', compRootElId);
        rootEl.setAttribute(compIdAttrName, compId);

        // Adding debug information for each component
        componentsDebugInfo[compId] = {"domId": compRootElId, "jsName": jsName, "status": "loading"};
        componentsDebugInfo[compId].info = debugInfo || "";

        // Load CSS
        require(['jquery'], function ($) {
            //Add class name in HTML by component name
            $(rootEl).addClass(getClassNames(jsName));
            if (styleAttrValue) {
                //Add class name in HTML by .css file name
                $(rootEl).addClass(getClassNames(styleAttrValue));
                loadCSSFiles(styleAttrValue);
            }
        });

        // Load and init Component
        require([jsName], function (jsComp) {
            componentsDebugInfo[compId].status = "ok";
            if (compLoadingTime) {
                componentsDebugInfo[compId]["loadingTime (ms)"] = Math.round(performance.now() - compLoadingTime);
            }
            components[compId] = createNewObj(jsComp);
            components[compId].init(compRootElId, config);
            compSupport.triggerCompEvent(rootEl, "init", [components[compId]]);

        }, function (err) {
            componentsDebugInfo[compId].status = "error";
            if (err.requireModules) {
                var errorMsg = "[compSupport] Error loading JS modules: " + err.requireModules.join(", ");
                // Adding module url to error message
                if (err.originalError) {
                    var el = err.originalError.srcElement || err.originalError.originalTarget;
                    if (el && el.src) {
                        errorMsg += "\n Url: " + el.src;
                    }
                }
                throw errorMsg;
            } else {
                throw "[compSupport] RequireJS Error: " + err.message;
            }
        });

    }


    // public methods
    return {

        /**
         * Find all not initialized JS components in HTML and init them.
         *
         * @param rootEl {HTMLObject|String} Reference on root HTML element inside which we need to initialize components.
         *               This param is optional by default we will search in all HTML document
         *
         *
         */
        init: function (rootEl) {
            require(['jquery'], function ($) {
                rootEl = rootEl ? $(rootEl) : $("html");
                rootEl.find("*[" + jsCompAttrName + "]").each(function () {
                    if ($(this).attr(compIdAttrName) == undefined) {

                        var compEl = this,
                            jsName = $(compEl).attr(jsCompAttrName),
                            config = {},
                            configAttrValue = $(compEl).attr(jsCompConfigAttrName),
                            styleAttrValue = $(compEl).attr(jsCompStylesAttrName);

                        // JSON configuration
                        if (configAttrValue) {
                            try {
                                config = $.parseJSON(configAttrValue) || {};
                            } catch (e) {
                                throw '[compSupport] Invalid JSON configuration in HTML attribute "' + jsCompConfigAttrName + '" for JS component ' + jsName + ', malformed JSON string: ' + configAttrValue;
                            }
                        }


                        loadComp(jsName, compEl, config, styleAttrValue);


                    }
                });
            });
        },

        onCompEvent: function (domRef, eventName, callbackFn) {
            require(['jquery'], function ($) {
                $(function () {
                    var compEl = $(domRef).closest("*[" + jsCompAttrName + "]");
                    if (compEl) {
                        if (compEl.on !== undefined) {
                            // using new on jQuery method (since jQuery 1.7)
                            compEl.on("jsComp-" + eventName, callbackFn);
                        } else {
                            // using legacy bind as a fall back (for jQuery < 1.7)
                            compEl.bind("jsComp-" + eventName, callbackFn);
                        }
                    } else {
                        throw "[compSupport] Can't add callback for component event `" + eventName + "`. Component not found: " + domRef;
                    }
                });
            });
        },

        triggerCompEvent: function (domRef, eventName, args) {
            require(['jquery'], function ($) {
                $(function () {
                    var compEl = $(domRef).closest("*[" + jsCompAttrName + "]");
                    if (compEl.attr('id') === undefined) {
                        logInfo("<JS_COMP_EVENT_FAILD: " + eventName + "> Component: #" + compEl.attr("id") + " (" + compEl.attr(jsCompAttrName) + ")");
                        throw "[compSupport] trigger comp event not on JS component HTML";
                    }
                    logInfo("<JS_COMP_EVENT: " + eventName + "> Component: #" + compEl.attr("id") + " (" + compEl.attr(jsCompAttrName) + ")");

                    // triggering event only on comp element (no bubble up the DOM hierarchy)
                    $(compEl).triggerHandler("jsComp-" + eventName, args || []);
                });
            });
        },

        /**
         * Call function in JS component binded to HTML element
         *
         * @param domRef {HTMLObject|String} Reference on components root HTML element or any element inside this component
         * @param functionName {String} Function name in JS component object to call
         * @param arg {Array} Optional parameter Function arguments array will be passed to the called function
         */
        callFunc: function (domRef, functionName, arg) {
            this.getComp(domRef, function (comp) {
                if (comp && comp[functionName]) {
                    comp[functionName].apply(comp, arg || []);
                } else {
                    throw "[compSupport] callFunc() Can't find function name: " + functionName;
                }
            }, this);
            // returning false to make it easy to use onclick for links (<a href="#" onclick="return compSupport.callFunc...)
            return false;
        },

        /**
         * Get component object
         *
         * @param domRef {HTMLObject|String} Reference on components root HTML element or any element inside this component
         * @param objectReadyCallback {Function} Callback function. Will be called with component object as first argument when component object is loaded and ready
         * @param callbackCallContext {Object} Context (this) for callback function.
         */
        getComp: function (domRef, objectReadyCallback, callbackCallContext) {
            var self = this;
            require(['jquery'], function ($) {
                $(function () {
                    var compEl = $(domRef).closest("*[" + jsCompAttrName + "]");
                    if (compEl) {
                        var id = compEl.attr(compIdAttrName);
                        if (id !== undefined && components[id]) {
                            // Component is ready and init
                            objectReadyCallback.call(callbackCallContext, components[id]);
                        } else {
                            // handle deferred component initialization
                            self.onCompEvent(compEl, "init", function (e, comp) {
                                objectReadyCallback.call(callbackCallContext, comp);
                            });
                        }
                    }
                });
            });
        },

        /**
         * Extending one component with another.
         * Use ths method in components to extend functionality.
         *
         * @param protoObj {Object} prototype object
         * @param propertiesObject {Object} properties object
         * @returns {Object} Creates a new object with the specified prototype object and properties.
         */
        extend: function (protoObj, propertiesObject) {
            var prop, obj;
            obj = createNewObj(protoObj);
            for (prop in propertiesObject) {
                if (propertiesObject.hasOwnProperty(prop)) {
                    obj[prop] = propertiesObject[prop];
                }
            }
            return obj;
        }

    };

})();
