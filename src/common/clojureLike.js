/**
 * author:wanghongxin492@emao.com
 * [data normorlize]
 */
function() {
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;

    /**
     * [native Class]
     */
    var Array = root.Array;
    var Object = root.Object;
    var Function = root.Function;
    var String = root.String;
    var Math = root.Math;

    /**
     * [native class's prototype]
     * @type {[Object]}
     */
    var ArrayProto = Array.prototype;
    var ObjectProto = Object.prototype;
    var FunctionProto = Function.prototype;
    var StringProto = String.prototype;

    /**
     * [native code]
     * @type {[function]}
     */
    var _apply = FunctionProto.apply;
    var _call = FunctionProto.call;
    var _has = ObjectProto.hasOwnProperty;
    var _toString = ObjectProto.toString;
    var _keys = Object.keys;
    var _$1slice = ArrayProto.slice;
    var _$2slice = StringProto.slice;
    var _shift = ArrayProto.shift;
    var _concat = ArrayProto.concat;
    var _reduce = ArrayProto.reduce;
    var _map = ArrayProto.map;
    var _$1indexOf = StringProto.indexOf;
    var _$2indexOf = ArrayProto.indexOf;
    var _max = Math.max;



    var alwaysfalse = always(false);
    var alwaystrue = always(true);
    var nothing = function() {};
    var alwayslist0 = always([]);
    var alwaysnull = always(null);
    var identity = function(x) {
        return x
    };
    /**
     * [closure]
     * @type {[function]}
     */
    var isArray = Array.isArray || isType('Array');
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var isArrayLike = function(list) {
        var l = existy(list) && list.length;
        return typeof l == 'number' && l >= 0 && l <= MAX_ARRAY_INDEX;
    };
    var isPureObject = isType('Object');
    var isFunction = isType('Function');
    var isNaN = function(x) {
        return x !== x;
    };
    var isInfiniteNumer = function(x) {
        return x === Infinity || x === -Infinity;
    };
    var isNumber = isType('Number');
    var isFiniteNumber = function(x) {
        return isNumber(x) && !isNaN(x) && x !== -Infinity && x !== Infinity;
    };
    var isPositive = function(x) {
        return x > 0;
    };
    var isNegative = function(x) {
        return x < 0;
    };
    var isString = isType('String');
    var isBoolean = isType('Bollen');
    var isRegExp = isType('RegExp');
    var isUndefined = isSame(void 0);
    var isNull = isSame(null);
    var apply = uncurrying(_apply);
    var call = uncurrying(_call);
    var has = uncurrying(_has);
    var $1slice = uncurrying(_$1slice);
    var toArray = fcheck(curry2r($1slice)(0), existy, []);
    var keys = fcheck(dispatch(_keys, $1keys),
        existy,
        alwayslist0
    );
    var slice = dispatch(invoker('slice', _$1slice), invoker('slice', _$2slice));
    var allKeys = fcheck($1allKeys, existy, alwayslist0);
    var defaults = createAssigner(keys, true);
    var defaultsAll = createAssigner(allKeys, true);
    var extend = createAssigner(allKeys);
    var assign = createAssigner(keys);
    var clone = partial1(assign, {});
    var reduce = fcheck(dispatch(invoker('reduce', _reduce), $1reduce),
        isArrayLike,
        function(xs, f, seed) {
            return seed
        }
    );
    var map = fcheck(dispatch(invoker('map', _map),
            fcheck($1map, isArrayLike, alwaysnull), $2map),
        existy,
        alwayslist0
    );
    var indexOf = dispatch(invoker('indexOf', _$1indexOf),
        invoker('indexOf', _$2indexOf),
        fcheck($1indexOf, isArrayLike, -1)
    );


    // function uncurrying(method) {
    //     return function() {
    //         var args = _slice.call(arguments);
    //         var context = _shift.call(args);
    //         return method.apply(context, args);
    //     }
    // }

    /**
     * [map a.f(b,c,...) to f(a,b,c,...)]
     * @param  {[function]} method [a.f(b,c,...)]
     * @return {[function]}        [f(a,b,c,...)]
     */


    function existy(x) {
        return x != null;
    }

    function truthy(x) {
        return existy(x) && x !== false;
    }

    function isType(type) {
        return function(x) {
            return _toString.call(x) == '[object ' + type + ']';
        }
    }

    function isSame(x) {
        return function(y) {
            return x === y;
        }
    }

    function always(x) {
        return function() {
            return x;
        }
    }

    function ifelse(question, right, wrong) {
        return question ? (isFunction(right) ? right() : right) : (isFunction(wrong) ? wrong() : wrong);;
    }

    function uncurrying(method) {
        return function() {
            return _call.apply(method, arguments);
        }
    }

    function invoker(methodName, method) {
        return function(target) {
            var args = arguments;
            return ifelse(
                existy(target) && isFunction(method) && method === target[methodName],
                function() {
                    return _call.apply(method, args);
                },
                null
            );
        }
    }

    function curry1(f) {
        return function(arg1) {
            return f(arg1);
        };
    }

    function curry2r(f) {
        return function(arg2) {
            return function(arg1) {
                return f(arg1, arg2);
            };
        };
    }

    function curry3r(f) {
        return function(arg3) {
            return function(arg2) {
                return function(arg1) {
                    return f(arg1, arg2, arg3);
                };
            };
        };
    }



    function dispatch() {
        var args = arguments;
        for (var i = 0, l = arguments.length; i < l; ++i) {
            if (!isFunction(args[i])) {
                args[i] = alwaysnull;
            }
        }
        return function() {
            var ret;
            for (var i = 0, l = args.length; i < l; i++) {
                if (!isNull(ret = apply(args[i], null, arguments))) {
                    return ret;
                }
            }
            return null;
        }
    }

    function fcheck(f, check, fail) {
        return function() {
            return truthy(apply(check, null, arguments)) ? apply(f, null, arguments) : (isFunction(fail) ? apply(fail, null, arguments) : fail);
        }
    }

    function ftransform(f, transform) {
        return function() {
            return apply(f, null, apply(transform, null, arguments));
        }
    }

    function initial(array, n) {
        return n = isFiniteNumber(n) ? n : 1, existy(array) ? $1slice(array, 0, _max(0, array.length - (isNegative(n) ? 1 : n))) : [];
    }

    function rest(array, n) {
        return n = isFiniteNumber(n) ? n : 1, existy(array) ? $1slice(array, isNegative(n) ? 1 : n) : [];
    }

    function first(array, n) {
        if (!existy(array)) return void 0;
        if (!existy(n)) return array[0];

        return n = isPositive(n) || n === 0 ? n : 1, $1slice(array, 0, n);
    }

    function last(array, n) {
        if (!existy(array)) return void 0;
        if (!existy(n)) return array[array.length - 1];
        return n = isPositive(n) || n === 0 ? n : 1, $1slice(array, _max(0, array.length - n));
    }

    function $1map(array, f, ctx) {
        var ret = [];
        for (var i = 0, l = array.length; i < l; ++i) {
            ret[i] = call(f, ctx, array[i], i, array);
        }
        return ret;
    }

    function $2map(object, f, ctx) {
        var _keys = keys(object);
        var ret = [];
        var key;
        for (var i = 0, l = _keys.length; i < l; ++i) {
            key = _keys[i];
            ret[i] = call(f, ctx, object[key], key, object);
        }
        return ret;
    }

    function $1reduce(array, f, seed, ctx) {
        var i = 0;
        seed = existy(seed) ? seed : array[i++];
        for (var l = array.length; i < l; ++i) {
            seed = call(f, ctx, seed, array[i], i, array);
        }
        return seed;
    }

    function cat(xs) {
        var args = arguments;
        return ifelse(
            isArrayLike(xs),
            function() {
                args = map(rest(args), function(x) {
                    if (!isArray(x) && isArrayLike(x)) {
                        return toArray(x);
                    } else {
                        return x;
                    }
                });
                return apply(_concat, isArray(xs) ? xs : toArray(xs), args);
            }, []
        );
    }

    function $1keys(obj) {
        var keys = [];
        for (var k in obj) {
            if (has(obj, k)) {
                keys[keys.length] = k;
            }
        }
        return keys;
    }

    function $1allKeys(obj) {
        var keys = [];
        for (var k in obj) {
            keys[keys.length] = k;
        }
        return keys;
    }

    function leader(fn) {
        return apply(fn, null, rest(arguments));
    }

    function leaders(fn, args) {
        return apply(fn, null, args);
    }

    function $1indexOf(arrayLike, x) {
        var ret = -1;
        map(arrayLike, function(x, k) {
            if (x === arrayLike[k]) ret = k;
        });
        return ret;
    }




    function partial1(fn) {
        var args = rest(arguments);
        return function() {
            return apply(fn, null, cat(args, arguments));
        };
    }

    /**
     * [bind description]
     * @return {[type]} [description]
     */
    function bind(fn, ctx) {
        var args = rest(arguments, 2);
        return function() {
            fn.apply(ctx, cat(args, arguments));
        };
    }

    function createAssigner(keysF, undefinedOnly) {
        return function(obj) {
            var l = arguments.length;
            if (l < 2 || !existy(obj)) return obj;
            for (var i = 1; i < l; ++i) {
                var source = arguments[i];
                var keys = keysF(source);
                var key;
                for (var j = 0, n = keys.length; j < n; ++j) {
                    key = keys[j];
                    if (!undefinedOnly || isUndefined(obj[key])) {
                        obj[key] = source[key];
                    }
                }
            }
            return obj;
        }
    }


    function compose() {
        var args = arguments;
        return function() {
            var l = args.length;
            var result = args[--l].apply(null, arguments);
            while (l--) {
                result = args[l].call(null, result)
            }
            return result;
        }
    }

    return {
        existy: existy,
        truthy: truthy,
        isArray: isArray,
        isArrayLike: isArrayLike,
        isPureObject: isPureObject,
        isFunction: isFunction,
        isNaN: isNaN,
        isInfiniteNumer: isInfiniteNumer,
        isNumber: isNumber,
        isFiniteNumber: isFiniteNumber,
        isString: isString,
        isBoolean: isBoolean,
        isRegExp: isRegExp,
        isUndefined: isUndefined,
        isNull: isNull,

        always: always,
        ifelse: ifelse,
        identity: identity,
        alwaysfalse: alwaysfalse,
        alwaystrue: alwaystrue,

        uncurrying: uncurrying,
        invoker: invoker,
        curry1: curry1,
        curry2r: curry2r,
        curry3r: curry3r,
        apply: apply,
        call: call,

        dispatch: dispatch,
        fcheck: fcheck,
        ftransform: ftransform,

        slice: slice,
        toArray: toArray,
        initial: initial,
        rest: rest,
        first: first,
        last: last,
        defaults: defaults,
        defaultsAll: defaultsAll,
        extend: extend,
        assign: assign,
        clone: clone,
        map: map,
        reduce: reduce,
        cat: cat,
        keys: keys,
        allKeys: allKeys,
        indexOf: indexOf,

        partial1: partial1,
        bind: bind,
        leader: leader,
        leaders: leaders,
        compose: compose
    }

}