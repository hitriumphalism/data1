/**
 * author:wanghongxin492@emao.com
 * [dom normorlize]
 */
function() {
    var root = window;
    var setTimeout = root.setTimeout;
    var Promise = root.Promise;
    var Array = root.Array;
    var Math = root.Math;
    var slice = Array.prototype.slice;
    var encodeURIComponent = root.encodeURIComponent;


    var isArray = Type('Array');
    var isObject = Type('Object');
    var isFunction = Type('Function');
    var isString = Type('String');

    $.prototype = [];
    $.prototype.constructor = $;
    $.uuid = uuid;
    $.bin2hex = bin2hex;
    $.Promise = dispatch(Promise, $1Promise);
    $.encodeURIComponent = encodeURIComponent;
    $.dispatch = dispatch;
    $.random = random;
    $.isInViewport = isInViewport;
    $.compile = compile;
    $.camelCase = camelCase;
    $.getCookie = getCookie;
    $.setCookie = setCookie;
    $.loadImg = loadImg;
    $.jsonp = jsonp;
    $.map = map;
    $.extend = extend;
    $.createClass = createClass;
    $.extendClass = extendClass;
    $.Events = function() {

        function on(event, callback, context, once) {
            this._events || (this._events = {});
            var tmp = this._events[event];
            this._events[event] = isArray(tmp) ? tmp : [];
            this._events[event].push({
                callback: callback,
                context: context,
                once: once
            });
        }
        return {
            on: function(event, callback, context) {
                on.call(this, event, callback, context);
            },
            off: function(event, callback) {
                if (!event) return this._events = void 0;
                if (!this._events) return this._events = void 0;
                if (!isArray(this._events[event])) return this._events[event] = void 0;
                if (!callback) return this._events[event] = void 0;
                this._events[event] = map(this._events[event], function(x, k, xs) {
                    return x.callback === callback ? null : x;
                });
            },
            trigger: function(event) {
                if (!this._events) return;
                if (!isArray(this._events[event])) return;
                var that = this;
                var args = Array.prototype.slice.call(arguments, 1);
                this._events[event] = map(this._events[event], function(x) {
                    x.callback.apply(x.context || that, args);
                    return x.once ? null : x;
                });
            },
            once: function(event, callback, context) {
                on.call(this, event, callback, context, true);
            }
        };
    }();
    $.oning = oning;
    $.listenTo = listenTo;
    $.listenToOnce = listenToOnce;
    $.stopListening = stopListening;
    var device = function() { //copy others
        var device,
            find,
            userAgent;
        device = {};

        userAgent = window.navigator.userAgent.toLowerCase();

        device.ios = function() {
            return device.iphone() || device.ipod() || device.ipad();
        };

        device.iphone = function() {
            return !device.windows() && find('iphone');
        };

        device.ipod = function() {
            return find('ipod');
        };

        device.ipad = function() {
            return find('ipad');
        };

        device.android = function() {
            return !device.windows() && find('android');
        };

        device.androidPhone = function() {
            return device.android() && find('mobile');
        };

        device.androidTablet = function() {
            return device.android() && !find('mobile');
        };

        device.blackberry = function() {
            return find('blackberry') || find('bb10') || find('rim');
        };

        device.blackberryPhone = function() {
            return device.blackberry() && !find('tablet');
        };

        device.blackberryTablet = function() {
            return device.blackberry() && find('tablet');
        };

        device.windows = function() {
            return find('windows');
        };

        device.windowsPhone = function() {
            return device.windows() && find('phone');
        };

        device.windowsTablet = function() {
            return device.windows() && (find('touch') && !device.windowsPhone());
        };

        device.fxos = function() {
            return (find('(mobile;') || find('(tablet;')) && find('; rv:');
        };

        device.fxosPhone = function() {
            return device.fxos() && find('mobile');
        };

        device.fxosTablet = function() {
            return device.fxos() && find('tablet');
        };

        device.meego = function() {
            return find('meego');
        };

        device.cordova = function() {
            return window.cordova && location.protocol === 'file:';
        };

        device.nodeWebkit = function() {
            return typeof window.process === 'object';
        };

        device.mobile = function() {
            return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego() || device.tablet();
        };

        device.tablet = function() {
            return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
        };

        device.desktop = function() {
            return !device.tablet() && !device.mobile();
        };

        device.television = function() {
            var i, tvString;

            television = [
                "googletv",
                "viera",
                "smarttv",
                "internet.tv",
                "netcast",
                "nettv",
                "appletv",
                "boxee",
                "kylo",
                "roku",
                "dlnadoc",
                "roku",
                "pov_tv",
                "hbbtv",
                "ce-html"
            ];

            i = 0;
            while (i < television.length) {
                if (find(television[i])) {
                    return true;
                }
                i++;
            }
            return false;
        };

        device.portrait = function() {
            return (window.innerHeight / window.innerWidth) > 1;
        };

        device.landscape = function() {
            return (window.innerHeight / window.innerWidth) < 1;
        };
        find = function(needle) {
            return userAgent.indexOf(needle) !== -1;
        };
        return device;
    }();
    $.device = device;

    function plain() {}

    function bin2hex(str) {
        return map(str, function(x) {
            return x.charCodeAt(0).toString(16);
        }).join('');
    }

    function random(begin, end) {
        return Math.floor(Math.random() * (end - begin)) + begin;
    }

    function dispatch() {
        var args = arguments;
        var x, r = null;
        for (var i = 0, l = args.length; i < l; ++i) {
            x = args[i];
            r = isFunction(x) ? x : null;
            if (r !== null) return r;
        }
        return plain;
    }

    function $1Promise(fn) {
        var value;
        var state = 'pending';
        var thunks = [];
        var errors = [];
        var promise;
        var flag = false;

        function resolve(val) {
            if (flag) return;
            flag = true;
            setTimeout(function() {
                value = val;
                state = 'fulfilled';
                thunks = next(value, thunks);
            }, 0);
        }

        function reject(err) {
            if (flag) return;
            flag = true;
            setTimeout(function() {
                value = err;
                state = 'rejected';
                errors = next(value, errors);
            }, 0);
        }

        function next(value, list) {
            if (list.length === 0) return [];
            list[0](value);
            next(value, slice.call(list, 1));
        }

        function dispatch(onFulfilled, onRejected) {
            if (state === 'pending') {
                thunks.push(onFulfilled);
                errors.push(onRejected);
            }
            if (state === 'fulfilled') {
                setTimeout(function() {
                    onFulfilled(value);
                }, 0);
            }
            if (state === 'rejected') {
                setTimeout(function() {
                    onRejected(value);
                }, 0);
            }
        }

        function wrapper(f, flag, resolve, reject) {
            var k = flag ? function(x) {
                reject(x)
            } : function(x) {
                resolve(x)
            };
            return isFunction(f) ? function(x) {
                try {
                    _call(f(x), resolve, reject);
                } catch (error) {
                    reject(error);
                }
            } : k;
        }

        function _call(value, resolve, reject) {
            if (value && value.__type__ === plain) {
                value.then(resolve, reject);
            } else {
                resolve(value);
            }
        }

        try {
            fn(resolve, reject);
        } catch (error) {
            reject(error);
        }
        return {
            then: function(onFulfilled, onRejected) {
                return new $1Promise(function(resolve, reject) {
                    dispatch(wrapper(onFulfilled, 0, resolve, reject),
                        wrapper(onRejected, 1, resolve, reject));
                });
            },
            'catch': function(onRejected) {
                return this.then(null, onRejected);
            },
            __type__: plain
        };
    }
    $1Promise.resolve = function(x) {
        return new $1Promise(function(resolve, reject) {
            resolve(x);
        });
    };

    $1Promise.reject = function(x) {
        return new $1Promise(function(resolve, reject) {
            reject(x);
        });
    };

    $1Promise.all = function(args) {
        return new $1Promise(function(resolve, reject) {
            for (var i = 0, l = args.length, all = new Array(l), allResults = []; i < l; ++i) {
                ! function(i) {
                    var tmp = args[i].__type__ === plain ? args[i] : $1Promise.resolve(args[i]);
                    tmp.then(function(value) {
                        all[i] = true;
                        allResults[i] = value;
                        var flag = true;
                        for (var j = 0, l = args.length; i < l; ++i) {
                            if (!all[i]) flag = false;
                        }
                        if (flag) resolve(allResults);
                    }, function(error) {
                        reject(error);
                    });
                }(i);
            }
        });
    }

    function createClass(className, proto) { //class system
        var $class = function() {
            proto.initialize && proto.initialize.apply(this, arguments);
        };
        plain.prototype = proto;
        var _proto = new plain;
        _proto.constructor = $class;
        _proto.__type = className;
        $class.prototype = _proto;
        $class.type = className;
        return $class;
    }

    function extendClass(className, superclass, proto) {
        var $child = function() {
            superclass.apply(this, arguments);
            proto.initialize && proto.initialize.apply(this, arguments);
        };
        plain.prototype = superclass.prototype;
        var _proto = new plain;
        $child.prototype = _proto;
        extend(_proto, proto);
        _proto.constructor = $child;
        _proto.__type = className;
        $child.type = className;
        return $child;
    }

    function Type(type) {
        return function(x) {
            return Object.prototype.toString.call(x) === '[object ' + type + ']';
        }
    }

    function listenTo(reporter, event, callback, context) {
        if (!reporter) return;
        if (reporter.on !== $.Events.on) $.extend(reporter, $.Events);
        reporter.on(event, callback, context);
    }

    function style(opts) {
        $.map(this, function(x) {
            var style = x.style;
            $.map(opts, function(x, k) {
                style[k] = x;
            });
        });
        return this;
    }

    function oning(reporter) {
        if (!reporter) return;
        if (reporter.on !== $.Events.on) $.extend(reporter, $.Events);
        return reporter;
    }

    function listenToOnce(reporter, event, callback, context) {
        if (!reporter) return;
        if (reporter.once !== $.Events.once) $.extend(reporter, $.Events);
        reporter.once(event, callback, context);
    }

    function stopListening(reporter, event, callback) {
        if (!reporter) return;
        if (reporter.on !== $.Events.on) return;
        reporter.off(event, callback);
    }

    function extend(target, source) {
        for (var i in source) {
            if (Object.prototype.hasOwnProperty.call(source, i)) {
                target[i] = source[i];
            }
        }
    }

    $.fn = $$.prototype = $.prototype;
    $.fn.html = html;
    $.fn.get = get;
    $.fn.on = on;
    $.fn.off = off;
    $.fn.attr = attr;
    $.fn.find = find;
    $.fn.css = style;

    function attr(name, value) {
        if (name === 'html') {
            if (isString(value)) {
                $.map(this, function(x) {
                    x.innerHTML = value;
                });
                return this;
            } else {
                return this[0] ? this[0].innerHTML : void 0;
            }
        }
        if (isString(name) && isString(value)) {
            $.map(this, function(x) {
                x.setAttribute(name, value);
            });
            return this;
        }
        if (isString(name) && !isString(value)) {
            return this[0] ? this[0].getAttribute(name) : void 0;
        }
    }

    var $on = function $on() {
        if (window.addEventListener) {
            return function(node, ev, fn) {
                node.addEventListener(ev, fn, false);
            }
        } else if (window.attachEvent) {
            return function(node, ev, fn) {
                node.attachEvent('on' + ev, fn);
            }
        }
    }();

    var $off = function $off() {
        if (window.removeEventListener) {
            return function(node, ev, fn) {
                node.removeEventListener(ev, fn, false);
            }
        } else if (window.detachEvent) {
            return function(node, ev, fn) {
                node.detachEvent('on' + ev, fn);
            }
        }
    }();

    function $(selector, context) {
        return new $$(selector, context);
    }

    function $$(selector, context) {
        return isString(selector) ? css(selector, this) : wrapper(selector, this), this;
    }

    function wrapper(node, that) {
        node == null ? that : that.push(node);
    }

    function get(n) {
        return this[n];
    }

    function html(html) {
        var ret,
            title = Object.prototype.toString.call(html),
            flag = (title === '[object String]' || title === '[object Function]');
        return ret = map(this, function(x, i, xs) {
            return flag ? (x.innerHTML = title === '[object Function]' ? html() : html) : x.innerHTML;
        }), flag ? this : ret;
    }

    function on(type, fn) {
        return map(this, function(node, index, nodes) {
            $on(node, type, fn);
        }), this;
    }

    function off(type, fn) {
        return map(this, function(node, index, nodes) {
            $off(node, type, fn);
        }), this;
    }

    /**
     * [only for id and tagname]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    function css(selector, that) {
        if (selector.charAt(0) === '#') {
            return that.push(document.getElementById(selector.slice(1))), that;
        } else {
            return that.push.apply(that, document.getElementsByTagName(selector));
        }
    }

    function find(tagName) {
        var that = $();
        $.map(this, function(x) {
            that.push.apply(that, x.getElementsByTagName(tagName));
        });
        return that;
    }


    function uuid() {
        return new Date().getTime().toString(16) + '-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function camelCase(str) { //first letter upperCase
        return str.replace(/^\w/, function(s) {
            return s.toUpperCase();
        });
    }

    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;

    }

    function setCookie(name, value, days) {
        days = days || 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    function min(array) {
        return Math.min.apply(Math, array);
    }

    function compile(str, data) { //copy other's,compile tmp to function that can output html by data
        var fn =
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") + "');}return p.join('');");
        return data ? fn(data) : fn;
    }

    function loadImg(url, fn) { //浏览器的bug，等函数调用完毕后，可能把图片对象给注销了，而它根本没有来得及发出请求
        //所以把图片对象注册到全局作用域上，等图片下载完毕再清除全局量
        var id = 'img' + (Math.random() + '').replace('.', '');
        var img = window[id] = new Image();
        img.onload = function() {
            fn && fn();
            window[id] = null;
        };
        img.src = url;
    }

    function jsonp(url, data, conf, cb, cache) {
        var conf = conf || [];
        var key = conf[0] || 'cb';
        var value = (conf[1] || 'defaults') + (cache ? '' : (Math.random() + '').replace('.', ''));
        data[key] = value;

        var arr = [];
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                arr.push(i + '=' + encodeURIComponent(data[i]));
            }
        }
        var str = arr.join('&');
        window[value] = function(json) {
            cb(json);
            oHead.removeChild(oS);
            window[data.cb] = null;
        };
        var oS = document.createElement('script');
        oS.src = url + '?' + str;
        var oHead = document.getElementsByTagName('head')[0];
        oHead.appendChild(oS);
    }

    function getNodeSize(node) {
        var width;
        var height;
        var tmp;

        if (node.getBoundingClientRect) {
            tmp = node.getBoundingClientRect();
            width = tmp.right - tmp.left;
            height = tmp.bottom - tmp.top;

        } else {
            width = node.offsetWidth;
            height = node.offsetHeight;
        }
        return {
            width: width,
            height: height
        }
    }

    function getNodePositionInDocument(node) {
        var offsetParent = node.offsetParent;
        var top = 0;
        var left = 0;
        while (offsetParent) {
            top += node.offsetTop;
            left += node.offsetLeft;
            node = offsetParent;
            offsetParent = node.offsetParent;
        }
        return {
            left: left,
            top: top
        };
    }

    function getNodePositionInViewport(node) {
        var documentLeft = getDocumentScrollLeft();
        var documentTop = getDocumentScrollTop();
        var positionInDocument = getNodePositionInDocument(node);
        var leftInViewport = positionInDocument.left - documentLeft;
        var topInViewport = positionInDocument.top - documentTop;
        var size = getNodeSize(node);
        return {
            left: leftInViewport,
            top: topInViewport,
            right: leftInViewport + size.width,
            bottom: topInViewport + size.height
        }
    }

    function getDocumentScrollLeft() {
        return document.documentElement.scrollLeft || document.body.scrollLeft;
    }

    function getDocumentScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }

    function getViewportWidth() {
        var maybeArray = [window.innerWidth,
            document.documentElement.clientWidth,
            document.body.clientWidth
        ];
        maybeArray = map(maybeArray, function(i) {
            i = parseInt(i);
            if (!(i && i > 0)) return null;
            return i;
        });
        return min(maybeArray);
    }

    function getViewportHeight() {
        var maybeArray = [window.innerHeight,
            document.documentElement.clientHeight,
            document.body.clientHeight
        ];
        maybeArray = map(maybeArray, function(i) {
            i = parseInt(i);
            if (!(i && i > 0)) return null;
            return i;
        });
        return min(maybeArray);
    }

    function isInViewport(node) {
        var viewportWidth = getViewportWidth();
        var viewportHeight = getViewportHeight();
        var positionInViewport = getNodePositionInViewport(node);
        return !(positionInViewport.right <= 0 || positionInViewport.left >= viewportWidth || positionInViewport.bottom <= 0 || positionInViewport.top >= viewportHeight);
    }

    function map(array, fn, ctx) { //iterator array or object
        var arr = [],
            tmp,
            type = Object.prototype.toString.call(array);
        if (!((typeof array.length === 'number') || isObject(array))) return;
        if (Object.prototype.toString.call(fn) === '[object Function]') {
            if (typeof array.length === 'number') {
                for (var i = 0, l = array.length; i < l; ++i) {
                    if ((tmp = fn.call(ctx, array[i], i, array)) != null) {
                        arr.push(tmp);
                    }
                }
            } else {
                for (var i in array) {
                    if (Object.prototype.hasOwnProperty.call(array, i) && ((tmp = fn.call(ctx, array[i], i, array)) != null)) {
                        arr.push(tmp);
                    }
                }
            }
            return arr;
        } else {
            var then = function(fn) { //closure
                return map(array, Object.prototype.toString.call(fn) == '[object Function]' ? fn : function() {});
            }
            return then.then = then;
        }
    }
    return $;
}