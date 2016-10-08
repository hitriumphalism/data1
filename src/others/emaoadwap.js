/*!
 * [emaoad]
 * @Author   wanghongxin492@emao.com
 * @DateTime 2016-05-10T14:14:51+0800
 */

/**
 * [description]
 * @param  {[type]} conf      [description]
 * @param  {[type]} _         [description]
 * @param  {[type]} helper    [description]
 * @param  {[type]} page      [description]
 * @param  {[type]} root      [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
;(function(conf, _, helper, page, root, undefined) {
    /**
     * [statisticalStrategies description]
     * @type {Object}
     */
    var statisticalStrategies = {
        a:function(){},
        b:function(){},
        b:function(){},
        b:function(){},
        b:function(){},
        b:function(){},
    };

    /**
     * [parseHTML description]
     * @return {[type]} [description]
     */
    function parseHTML() {}

    /**
     * [findZone description]
     * @return {[type]} [description]
     */
    function findZone() {}

    /**
     * [parseData description]
     * @return {[type]} [description]
     */
    function parseData() {}

    /**
     * [render description]
     * @return {[type]} [description]
     */
    function render() {}

    /**
     * [report description]
     * @return {[type]} [description]
     */
    function report() {}

    /**
     * [getPosition description]
     * @return {[type]} [description]
     */
    function getPosition() {}

    /**
     * [setParams description]
     */
    function setParams() {}
}({
        PREFIX_CONTAINER: 'emao-ad',
        PARAMS_URL: 'http://loc.emao.com/getareabyip',
        RESOURCE_URL: 'http://adms.emao.com/fl/getadc'
    },

    /**
     * [_ description]
     * @return {[type]} [description]
     */
    function _() {
        /**
         * [root description]
         * @type {[type]}
         */
        var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

        /**
         * [Array description]
         * @type {[type]}
         */
        var Array = root.Array;
        var Object = root.Object;
        var Function = root.Function;

        /**
         * [bind description]
         * @return {[type]} [description]
         */
        function bind() {}

        function map() {}

        function dispatch() {
            var args=arguments;
            return function(){
                for(var i=0,l=arguments.length;i<l;i++)

            }
        }

        function uncurrying(method){
            return function (){
                var args=Array.prototype.slice.call(arguments);
                var context=Array.prototype.shift.call(args);
                return method.apply(context,args);
            }
        }

        function mixin() {}

        function reduce() {}

        function compose() {}

        return {
            bind: bind,
            map: map,
            dispatch: dispatch,
            mixin: mixin,
            reduce: reduce,
            compose: compose
        }

    }(),

    /**
     * [t description]
     * @return {[type]} [description]
     */
    function t() {
        function createClass() {}

        function extendClass() {}

        function camelCase() {}

        function getCookie() {}

        function setCookie() {}

        function complie() {}

        function jsonp() {}

        function ajax() {}

        function $() {}

        function uuid() {}

        return {
            createClass: createClass,
            extendClass: entendClass,
            camelcase: camelcase,
            getCookie: getCookie,
            setCookie: setCookie,
            complie: complie,
            jsonp: jsonp,
            ajax: ajax,
            $: $,
            uuid: uuid
        };
    }(),

    document,
    window));
