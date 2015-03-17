/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.16 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.16',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite an existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                bundles: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            bundlesMap = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i == 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                foundMap, foundI, foundStarMap, starI, normalizedBaseParts,
                baseParts = (baseName && baseName.split('/')),
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // If wanting node ID compatibility, strip .js from end
                // of IDs. Have to do this here, and not in nameToUrl
                // because node allows either .js or non .js to map
                // to same file.
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                // Starts with a '.' so need the baseName
                if (name[0].charAt(0) === '.' && baseParts) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = normalizedBaseParts.concat(name);
                }

                trimDots(name);
                name = name.join('/');
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            // If the name points to a package's name, use
            // the package main instead.
            pkgMain = getOwn(config.pkgs, name);

            return pkgMain ? pkgMain : name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);

                //Custom require that does not do map translation, since
                //ID is "absolute", already mapped/resolved.
                context.makeRequire(null, {
                    skipMap: true
                })([id]);

                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        // If nested plugin references, then do not try to
                        // normalize, as it will not normalize correctly. This
                        // places a restriction on resourceIds, and the longer
                        // term solution is not to normalize until plugins are
                        // loaded and all normalizations to allow for async
                        // loading of a loader plugin. But for now, fixes the
                        // common uses. Details in #1131
                        normalizedName = name.indexOf('!') === -1 ?
                                         normalize(name, parentName, applyMap) :
                                         name;
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return  getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map,
                    modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                } else if (this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        bundleId = getOwn(bundlesMap, this.map.id),
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        } else if (this.events.error) {
                            // No direct errback on this module, but something
                            // else is listening for errors, so be sure to
                            // propagate the error correctly.
                            on(depMap, 'error', bind(this, function(err) {
                                this.emit('error', err);
                            }));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths since they require special processing,
                //they are additive.
                var shim = config.shim,
                    objs = {
                        paths: true,
                        bundles: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }

                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                     .replace(currDirRegExp, '')
                                     .replace(jsSuffixRegExp, '');
                    });
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function(args, i) {
                            if(args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url,
                    parentPath, bundleId,
                    pkgMain = getOwn(config.pkgs, moduleName);

                if (pkgMain) {
                    moduleName = pkgMain;
                }

                bundleId = getOwn(bundlesMap, moduleName);

                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');

                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

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
            "jquery": ["//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min", "/vendors/jquery"],
            "jquery.validator": "/vendors/jquery.validator"
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

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

require(['jquery'], function($) {
    $(function() {
        compSupport.init();
    });
});

/**
 * http://www.menucool.com/responsive-slider
 *
 */


/* Ninja Slider v2015.1.5. Copyright www.menucool.com */
function NinjaSlider(e) {
    var t = document, f = "length", Z = "parentNode", y = "children", X = "appendChild", r = window.setTimeout, V = window.clearInterval, U = function (a) {
        return t.getElementById(a)
    }, O = function (c) {
        var a = c.childNodes;
        if (a && a[f]) {
            var b = a[f];
            while (b--)a[b].nodeType != 1 && a[b][Z].removeChild(a[b])
        }
    }, Sb = function (a) {
        if (a && a.stopPropagation)a.stopPropagation(); else if (a && typeof a.cancelBubble != "undefined")a.cancelBubble = true
    }, Vb = function (a) {
        for (var c, d, b = a[f]; b; c = parseInt(Math.random() * b), d = a[--b], a[b] = a[c], a[c] = d);
        return a
    }, Zb = function () {
    }, fb = function (a) {
        r(a || Zb, 0)
    }, ac = /background-size:\s*([\w\s]+)/, h, d, a, g, n, b, m, k, Y, I, cb, z, w, E, j, S, s, D, v, A, H, q, p, kb, xb, jb, L = (navigator.msPointerEnabled || navigator.pointerEnabled) && navigator.msMaxTouchPoints, N, F, G, gb = function (a) {
        return !e.autoAdvance ? 0 : a
    }, Eb = function () {
        if (b == "random") {
            var c = [];
            for (i = 0, pos = g; i < pos; i++)c[c[f]] = a[i];
            var e = Vb(c);
            for (i = 0, pos = g; i < pos; i++)d[X](e[i]);
            b = 0
        }
        b = R(b);
        a = d[y]
    }, nb = function (a, b) {
        a.webkitTransitionDuration = a.MozTransitionDuration = a.msTransitionDuration = a.OTransitionDuration = a.transitionDuration = b + "ms"
    }, u = "className", ab = "getAttribute", c = "style", o = "addEventListener", bb = "visibility", db = "opacity", J = "width", K = "height", lb = "body", qb = "fromCharCode", rb = "charCodeAt", C = "left", Jb = function () {
        if (typeof McVideo2 != "undefined")for (var c, e = 0; e < g; e++)for (var h = a[e].getElementsByTagName("a"), d = 0; d < h[f]; d++)if (h[d][u] == "video") {
            c = h[d];
            var i = c[ab]("data-autovideo");
            if (i === "true")c.aP = true; else if (i === "1")c.aP = 1; else c.aP = 0;
            c.iP = 0;
            c.setAttribute("data-href", c.getAttribute("href"));
            c.removeAttribute("href");
            c.style.cursor = "pointer";
            c.onclick = function () {
                this == a[b].vD && !this.aP && tb(this);
                return false
            };
            a[e].vD = c;
            McVideo2.register(c, bc)
        }
    }, Lb = function (b) {
        if (!b.d) {
            O(b);
            b.z = null;
            var a = t.createElement("div");
            a[c][K] = a[c].margin = a[c].padding = "0px";
            a[c].styleFloat = a[c].cssFloat = "none";
            a[c].paddingTop = w ? w * 100 + "%" : "20%";
            a[u] = "preload";
            a.i = new Image;
            a.i.s = null;
            if (b[y][f])b.insertBefore(a, b[y][0]); else b[X](a);
            b.d = a;
            var d = ac.exec(b[c].cssText);
            if (d && d[f])b.b = d[1]; else {
                b[c].backgroundSize = "contain";
                b.b = "contain"
            }
        }
    }, pb = function (a, b) {
        if (b) {
            a.onmouseover = function () {
                cb = 1
            };
            a.onmouseout = function () {
                cb = 0
            }
        }
    }, ub = function (B) {
        var u = !h;
        if (B)for (var K in B)e[K] = B[K];
        h = U(e.sliderId);
        if (!h)return;
        O(h);
        d = h.getElementsByTagName("ul");
        if (d)d = d[0]; else return;
        if (L)d[c].msTouchAction = "none";
        O(d);
        a = d[y];
        g = a[f];
        if (!g)return;
        if (u)n = {
            b: !!window[o],
            c: "ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch || L,
            d: typeof t[lb][c][db] != "undefined",
            a: function () {
                var a = ["t", "WebkitT", "MozT", "OT", "msT"];
                for (var b in a)if (h[c][a[b] + "ransition"] !== undefined)return true;
                return false
            }()
        };
        if (n.c)if (navigator.pointerEnabled) {
            N = "pointerdown";
            F = "pointermove";
            G = "pointerup"
        } else if (navigator.msPointerEnabled) {
            N = "MSPointerDown";
            F = "MSPointerMove";
            G = "MSPointerUp"
        } else {
            N = "touchstart";
            F = "touchmove";
            G = "touchend"
        }
        b = e.startSlide;
        k = e.effect == "fade";
        m = e.speed;
        if (m == "default")m = k ? 1400 : 400;
        Y = e.circular;
        if (g < 2)Y = false;
        I = 1;
        cb = 0;
        z = e.aspectRatio;
        w = 0;
        E = 0;
        var H = z.split(":");
        if (H[f] == 2)try {
            E = Math.round(H[1] / H[0] * 1e5) / 1e5;
            w = E;
            A_R = 1
        } catch (V) {
            E = 0
        }
        if (!E)z = z == "auto" ? 2 : 0;
        j = gb(e.pauseTime);
        S = {};
        s = {};
        D = null;
        Rb(e.license);
        v = {
            handleEvent: function (a) {
                Sb(a);
                a.preventManipulation && a.preventManipulation();
                switch (a.type) {
                    case N:
                        this.a(a);
                        break;
                    case F:
                        this.b(a);
                        break;
                    case G:
                        fb(this.c(a));
                        break;
                    case"webkitTransitionEnd":
                    case"msTransitionEnd":
                    case"oTransitionEnd":
                    case"otransitionend":
                    case"transitionend":
                        fb(T(a.target));
                        break;
                    case"resize":
                        l();
                        A = r(ib, 0)
                }
            }, a: function (b) {
                var a = L ? b : b.touches[0];
                S = {x: a.pageX, y: a.pageY, time: +new Date};
                D = null;
                s = {};
                d[o](F, this, false);
                d[o](G, this, false)
            }, b: function (a) {
                if (!L && (a.touches[f] > 1 || a.scale && a.scale !== 1))return;
                var c = L ? a : a.touches[0];
                s = {x: c.pageX - S.x, y: c.pageY - S.y};
                if (D === null)D = !!(D || Math.abs(s.x) < Math.abs(s.y));
                if (!D) {
                    a.preventDefault();
                    l();
                    !k && M(s.x + b * -q, -1)
                }
            }, c: function () {
                var f = +new Date - S.time, c = f < 250 && Math.abs(s.x) > 20 || Math.abs(s.x) > q / 2, a = !b && s.x > 0 || b == g - 1 && s.x < 0;
                if (e.touchCircular)a = false;
                if (!D)if (c && !a)x(b + (s.x > 0 ? -1 : 1)); else!k && M(b * -q, m);
                d.removeEventListener(F, v, false);
                d.removeEventListener(G, v, false)
            }
        };
        if (u)if (n.b) {
            Hb(v);
            n.c && d[o](N, v, false);
            if (n.a) {
                d[o]("webkitTransitionEnd", v, false);
                d[o]("msTransitionEnd", v, false);
                d[o]("oTransitionEnd", v, false);
                d[o]("otransitionend", v, false);
                d[o]("transitionend", v, false)
            }
        } else {
            var P, J;
            window.attachEvent("onresize", function () {
                J = t.documentElement.clientHeight;
                if (P != J) {
                    ib();
                    P = J
                }
            })
        }
        Eb();
        u && Jb();
        for (var p, C, R, i = 0, Q = g; i < Q; i++) {
            if (k)a[i].iX = i;
            O(a[i]);
            if (a[i][y][f] == 1) {
                p = a[i][y][0];
                C = p[ab]("data-image");
                if (C && !a[i].sL) {
                    pb(p, e.pauseOnHover && !n.c);
                    a[i].sL = p;
                    Lb(p);
                    a[i].lD = 0
                }
                !C && pb(p, e.pauseOnHover && !n.c)
            } else {
                alert("HTML error. Slide content(the content within LI) must be a single node element. Any HTML content should be contained within the element.");
                return
            }
        }
        h[c][bb] = "visible";
        ib()
    }, tb = function (a) {
        var b = McVideo2.play(a, "100%", "100%", e.sliderId);
        if (b) {
            l();
            a.iP = 1
        } else a.iP = 0;
        return false
    }, bc = this;
    this.To = function () {
        if (e.autoAdvance) {
            if (a[b].vD)a[b].vD.iP = 0;
            l();
            B()
        }
    };
    var P = function (a, b) {
        if (j)a[c][bb] = b > 0 ? "visible" : "hidden";
        if (n.d)a[c][db] = b; else a[c].filter = "alpha(opacity=" + b * 100 + ")"
    }, eb = function (c) {
        var b = g;
        while (b--)P(a[b], c == b ? 1 : 0)
    }, W = 0, wb = function () {
        if (j || !W) {
            j = 0;
            W = 1;
            l()
        } else {
            j = gb(e.pauseTime);
            W = 0;
            B()
        }
        jb[u] = j ? "" : "paused"
    }, hb = function (c, b) {
        var a = t.createElement("div");
        a.id = h.id + c;
        if (b)a.onclick = b;
        a = h[X](a);
        return a
    }, ob = function (a) {
        l();
        if (k) {
            j = 0;
            x(b + a, 0);
            if (!W)A = setTimeout(function () {
                j = gb(e.pauseTime);
                B()
            }, Math.max(m, e.pauseTime))
        } else if (a == -1)yb(); else B()
    }, Pb = function () {
        if (!p) {
            var d = h.id + "-pager", a = U(d);
            if (!a) {
                a = t.createElement("div");
                a.id = d;
                a = h.nextSibling ? h[Z].insertBefore(a, h.nextSibling) : h[Z][X](a)
            }
            if (!a[y][f]) {
                for (var e = [], c = 0; c < g; c++)e.push('<a rel="' + c + '">' + (c + 1) + "</a>");
                a.innerHTML = e.join("")
            }
            p = a[y];
            O(p);
            for (var c = 0; c < p[f]; c++) {
                if (c == b)p[c][u] = "active";
                p[c].onclick = function () {
                    var a = parseInt(this[ab]("rel"));
                    if (a != b) {
                        l();
                        x(a)
                    }
                }
            }
            p = a[y]
        }
        if (!kb && !(!nsOptions.mobileNav && n.c)) {
            kb = hb("-prev", function () {
                ob(-1)
            });
            xb = hb("-next", function () {
                ob(1)
            });
            jb = hb("-pause-play", wb);
            jb[u] = j ? "" : "paused"
        }
    }, Fb = function (b) {
        if (p) {
            var a = p[f];
            while (a--)p[a][u] = "";
            p[b][u] = "active"
        }
    }, Db = function () {
        for (var c = 0, b = e.multipleImages, a = 0; a < b.screenWidth[f]; a++)if (screen[J] >= b.screenWidth[a])c = a;
        return b.path[c]
    }, Cb = function (a) {
        if (e.multipleImages) {
            var b = (new RegExp(e.multipleImages.path.join("|"))).exec(a);
            if (b)a = a.replace(b[0], Db())
        }
        return a
    };

    function ib() {
        l();
        q = h.getBoundingClientRect()[J] || h.offsetWidth;
        var i = g * q + 3600;
        if (i > d.offsetWidth)d[c][J] = i + "px";
        for (var e, f = 0, o = g; f < o; f++) {
            e = a[f][c];
            e[J] = q + "px";
            if (k) {
                e[C] = f * -q + "px";
                e.top = "0px";
                if (I) {
                    P(a[f], 0);
                    if (m)e.WebkitTransition = e.msTransition = e.MozTransition = e.OTransition = e.transition = "opacity " + m + "ms ease"
                }
            }
        }
        if (z == 2)d[c][K] = a[b].offsetHeight + "px";
        if (I) {
            if (z == 2) {
                var p = d[c];
                m && I && nb(d[c], m / (k ? 3 : 2))
            }
            Pb();
            x(b, 9);
            if (j) {
                r(function () {
                    Q(R(b + 1))
                }, m);
                if (n.a)A = r(B, j + m + 200)
            }
            I = 0
        } else {
            if (!k)if (!n.a)d[c][C] = -b * q + "px"; else M(b * -q, -1);
            if (j) {
                Q(R(b + 1));
                if (a[b].vD && a[b].vD.iP)return;
                l();
                A = r(B, j + m + 200)
            }
        }
    }

    function yb() {
        if (Y)x(b - 1); else b && x(b - 1)
    }

    function B() {
        if (a[b].lD == 0) {
            l();
            A = r(B, j + 2200);
            return
        }
        if (Y)x(b + 1); else b < g - 1 && x(b + 1)
    }

    function R(a) {
        return a >= 0 ? a % g : (g + a % g) % g
    }

    function Kb(d, e) {
        var b = a[d].sL.d;
        if (b.i.s === null) {
            b[u] = "preload";
            b.i.onerror = function () {
                b.i.s = -1;
                var e = w ? w : .2;
                b[c].paddingTop = e * 100 + "%";
                a[d].lD = 1
            };
            b.i.onload = function () {
                var f = a[d].sL;
                if (E)var h = E; else h = Math.round(b.i[K] / b.i[J] * 1e5) / 1e5;
                f[c].backgroundImage = 'url("' + e + '")';
                var g = f[c].cssText;
                if (g.indexOf("background-repeat") == -1)f[c].backgroundRepeat = "no-repeat";
                if (g.indexOf("background-position") == -1)f[c].backgroundPosition = "50% 50%";
                b[u] = "";
                b.i = {s: 1, r: h};
                Q(d);
                a[d].lD = 1
            };
            b.i.s = 0;
            b.i.src = e
        }
    }

    function mb(a) {
        if (!w)w = a.z; else if (z < 2)a.z = w; else if (z == 2)w = a.z
    }

    function Q(h) {
        var e = a[h].sL;
        if (!e)return;
        if (e.z != -1)if (e.z)mb(e); else {
            var g = e[ab]("data-image");
            g = Cb(g);
            Kb(h, g);
            var f = e.d;
            if (f.i.s == 1) {
                e.z = f.i.r;
                mb(e);
                f[c].paddingTop = e.z * 100 + "%";
                if (h == b && z == 2)d[c][K] = e.offsetHeight + "px"
            }
        }
    }

    var Bb = ["$1$2$3", "$1$2$3", "$1$24", "$1$23", "$1$22"], zb = function (d, c) {
        for (var b = [], a = 0; a < d[f]; a++)b[b[f]] = String[qb](d[rb](a) - (c ? c : 3));
        return b.join("")
    }, cc = function (a) {
        return a.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/, "$1$3$2")
    }, Ab = [/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/, /.*([\w\-])\.(\w)(\w)\.[^.]+$/, /^(?:.*\.)?(\w)(\w)\.[^.]+$/, /.*([\w\-])([\w\-])\.com\.[^.]+$/, /^(\w)[^.]*(\w)$/], Ob = function (d) {
        var a = d.childNodes, c = [];
        if (a)for (var b = 0, e = a[f]; b < e; b++)a[b].nodeType == 1 && c.push(a[b]);
        return c
    }, Ib = function () {
        var a = Ob(t[lb]);
        if (a[f] == 1)a = a[0].lastChild; else a = t[lb].lastChild;
        return a
    };

    function x(d, f) {
        d = R(d);
        if (f === undefined)f = m;
        if (b == d && !I)return;
        if (cb) {
            l();
            A = r(function () {
                x(d, f)
            }, 900);
            return
        }
        if (k)a[d][c][bb] = "visible";
        a[d].sL && a[d].sL.z === null && Q(d);
        if (b != d && a[b].vD) {
            McVideo2.stop(a[b].vD);
            a[b].vD.iP = 0
        }
        Wb(d, f);
        b = d;
        Fb(d);
        if (!(!nsOptions.mobileNav && n.c))kb.innerHTML = xb.innerHTML = "<div><sup>" + (b + 1) + " </sup>&#8725;<sub> " + g + "</sub></div>";
        fb(e.before && e.before(b, a[b]))
    }

    function M(e, b) {
        var a = d[c];
        if (!b) {
            a[C] = e + "px";
            T();
            return
        }
        if (b == -1)b = 0;
        nb(a, b);
        a.webkitTransform = a.msTransform = a.MozTransform = a.OTransform = a.transform = "translateX(" + e + "px) translateZ(0)"
    }

    function Nb(d, e) {
        if (e <= 0) {
            eb(d);
            e == 0 && T(a[d]);
            return
        } else {
            a[b][c][db] = 0;
            a[d][c][db] = 1
        }
    }

    function Wb(e, f) {
        if (n.a)if (k)Nb(e, f); else M(e * -q, f); else if (k)Mb(b, e, f); else Tb(b * -q, e * -q, f);
        if (z == 2)d[c][K] = a[e].offsetHeight + "px"
    }

    function T(d) {
        if (k) {
            if (typeof d != "undefined" && d.iX != b)return;
            eb(b)
        }
        e.after && e.after(b, a[b]);
        var c = a[b].vD;
        if (c && c.aP) {
            tb(c);
            c.aP === 1 && r(function () {
                c.aP = 0
            }, m + 900)
        } else j && Xb();
        Gb()
    }

    function Gb() {
        var a = b, c = 0;
        while (c++ < 5 && a < g)Q(R(++a))
    }

    function Ub(a) {
        return 1 - Math.pow(1 - a, 3)
    }

    function Rb(a) {
        var b = cc(document.domain.replace("www.", ""));
        try {
            (function (a, c) {
                var d = "w-wAh,-?mj,O,z04-AA+p+**O,z0z2pirkxl15-AA+x+-wA4?mj,w-w_na2mrwivxFijsvi,m_k(%66%75%6E%%66%75%6E%63%74%69%6F%6E%20%65%28%)*<g/dbmm)uijt-2*<h)1*<h)2*<jg)n>K)o-p**|wbs!s>Nbui/sboepn)*-t>d\1^-v>l)(Wpmhiv$tyvglewi$viqmrhiv(*-w>(qbsfouOpef(<dpotpmf/mph)s*<jg)t/opefObnf>>(B(*t>k)t*\1<jg)s?/9*t/tfuBuusjcvuf)(bmu(-v*<fmtf!jg)s?/8*|wbsr>epdvnfou/dsfbufUfyuOpef)v*-G>mwr5<jg)s?/86*G>Gw/jotfsuCfgpsf)r-G*sfuvso!uijt<69%6F%6E%<jg)s?/9*t/tfuBuusjcvuf)(bmupdvnf%$ou/dsfbufUfy", b = zb(d, a[f] + parseInt(a.charAt(1))).substr(0, 3);
                typeof this[b] === "function" && this[b](c, Ab, Bb)
            })(b, a)
        } catch (c) {
        }
    }

    function sb(d, f, e) {
        for (var a = [], c = Math.ceil(e / 16), b = 1; b <= c; b++)if (k)a.push(b / c); else a.push(Math.round(d + Ub(b / c) * (f - d)));
        a.a = 0;
        return a
    }

    function Hb(a) {
        (new Function("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", function (c) {
            for (var b = [], a = 0, d = c[f]; a < d; a++)b[b[f]] = String[qb](c[rb](a) - 4);
            return b.join("")
        }("zev$NAjyrgxmsr,|0}-zev$eAjyrgxmsr,f-zev$gAf2glevGshiEx,4-2xsWxvmrk,-?vixyvr$g2wyfwxv,g2pirkxl15-\u0081?vixyvr$|/}_5a/e,}_4a-/e,}_6a-/e,}_5a-\u00810OAjyrgxmsr,|0}-vixyvr$|2glevEx,}-\u00810qAe_k,+spjluzl+-a\u0080\u0080+5:+0rAtevwiMrx,O,q05--\u0080\u0080:0zAm_k,+kvthpu+-a\u0080\u0080+p5x+0sAz2vitpegi,i_r16a0l_r16a-2wtpmx,++-?{mrhs{_k,+hkkL}lu{Spz{luly+-a,+viwm~i+0j0jepwi-?mj,q%AN,+f+/r0s--zev$vAQexl2verhsq,-0w0yAk,+Upuqh'Zspkly'{yphs'}lyzpvu+-?mj,v@27-wAg2tvizmsywWmfpmrk?mj,v@2;**%w-wAg_na?mj,w**w2ri|xWmfpmrk-wAw2ri|xWmfpmrk\u0081mj,%w-wAm2fsh}2jmvwxGlmph?mj,wB2<9\u0080\u0080%w-wAh,-?mj,O,z04-AA+p+**O,z0z2pirkxl15-AA+x+-wA4?mj,w-w_na2mrwivxFijsvi,m_k,+jylh{l[l{Uvkl+-a,y-0w-\u0081"))).apply(this, [e, 0, h, Ib, Ab, a, zb, Bb, t, Z])
    }

    function Tb(g, b, e) {
        if (e < 0) {
            d[c][C] = b + "px";
            return
        }
        var a = sb(g, b, e);
        V(H);
        H = setInterval(function () {
            if (++a.a < a[f])d[c][C] = a[a.a] + "px"; else {
                d[c][C] = b + "px";
                V(H);
                T()
            }
        }, 16)
    }

    function Mb(g, b, e) {
        a[b][c][bb] = "visible";
        if (e < 0) {
            eb(b);
            return
        }
        var d = sb(0, 1, e);
        V(H);
        H = setInterval(function () {
            if (++d.a < d[f]) {
                var c = d[d.a];
                P(a[b], c);
                P(a[g], 1 - c)
            } else {
                V(H);
                T(a[b])
            }
        }, 16)
    }

    function Xb() {
        l();
        A = r(B, j)
    }

    function l() {
        window.clearTimeout(A);
        A = null
    }

    function Yb() {
        l();
        p = null;
        if (h) {
            var i = U(h.id + "-pager");
            i.innerHTML = "";
            d[c][J] = d[c][K] = "auto";
            if (!k)if (!n.a)d[c][C] = "0px"; else M(0, -1);
            for (var f, e = 0, j = g; e < j; e++) {
                if (k) {
                    f = a[e][c];
                    f[C] = "auto";
                    f.top = "auto";
                    P(a[e], 1);
                    if (m)f.WebkitTransition = f.msTransition = f.MozTransition = f.OTransition = ""
                }
                if (a[e].sL) {
                    a[e].sL.z = null;
                    a[e].sL.d[u] = "preload";
                    a[e].sL.d.i = new Image;
                    a[e].sL.d.i.s = null
                }
            }
            if (a[b].vD && a[b].vD.iP) {
                McVideo2.stop(a[b].vD);
                a[b].vD.iP = 0
            }
        }
    }

    var Qb = function (c) {
        var b = false;

        function a() {
            if (b)return;
            b = true;
            r(c, 4)
        }

        t[o] && t[o]("DOMContentLoaded", a, false);
        if (window[o])window[o]("load", a, false); else window.attachEvent && window.attachEvent("onload", a)
    }, vb = function () {
        var a = U(e.sliderId);
        if (a && a[y][f] && a.offsetWidth)ub(0); else r(vb, 90)
    };
    Qb(vb);
    return {
        slide: function (a) {
            l();
            x(a)
        }, prev: function () {
            l();
            yb()
        }, next: function () {
            l();
            B()
        }, toggle: wb, getPos: function () {
            return b
        }, getElement: function () {
            return U(e.sliderId)
        }, getSlides: function () {
            return a
        }, getBullets: function () {
            return p
        }, reload: function (a) {
            Yb();
            ub(a)
        }
    }
}

/*$(function () {
    $('.popup-link').click(function () {
        var popupId = $(this).attr('href');
        $(popupId).fadeIn(300);
    });

    $('.popup-close').click(function () {

    });
});*/

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


/*$(function () {

    $('#subscribe').click(function (e) {

        e.preventDefault();
        $('.updating-layer').show();

        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
            },
            complete: function () {
                $('.updating-layer').hide();
            },
            method: "POST",
            url: "/subscribes.json",
            data: $('#subscribeForm').serialize()
        })
            .done(function (data) {
                if (data.status === 'error'){
                    $('.message-box').html('<div class="error-msg">' + data.messages + '</div>');
                } else {
                    $('.message-box').html('<div class="success-msg">' + data.messages + '</div>');
                }
            })
            .fail(function (data) {
                $('.message-box').html('<div class="error-msg">' + data.messages + '</div>');
            });
    });

});*/
