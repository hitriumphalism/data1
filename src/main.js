/*!
 * [emaoad]
 * @Author   wanghongxin492@emao.com
 * @DateTime 2016-05-10T14:14:51+0800
 */
;
(function(conf, _, $, _isMobile, page, root, base64, undefined) {
    //在这里扩展统计逻辑
    var statisticalStrategies = [ //external>local>remote
        function provinceId(province_id) {
            return external.provinceId || local.provinceId || remote.provinceId;
        },
        function cityId(city_id) {
            return external.cityId || local.cityId || remote.cityId;
        },
        function userId() {
            return external.userId || local.userId || 0;
        }
    ];
    //在这里扩展广告数据的取值赋值逻辑
    var Data = $.createClass('Data', {
        initialize: function(resource, cityId) {
            this.resource = resource;
            this.getData(cityId);
        },
        getImg: function() {
            var data = this.data;
            return data && data.content;
        },
        getData: function(cityId) { //city>country>defaultt
            if (this.data) {
                return this.data;
            }
            var citys = this.resource.city || {};
            for (var key in citys) {
                if (citys.hasOwnProperty(key)) {
                    var cities = key.split('-');
                    var finded = _.indexOf(cities, cityId + '');
                    if (finded > -1) {
                        this.data = citys[key].data;
                        return citys[key].data;
                    }
                }
            }
            if (this.resource.country) {
                this.data = this.resource.country.data;
                return this.resource.country.data;
            }
            if (this.resource['default']) {
                var defaultt = this.resource['default']
                this.data = defaultt.ifshowdefault == 1 ? defaultt.data : undefined;
                return this.data;
            }
        },
        getTpl: function() {
            var data = this.data;
            return data && (data.hasOwnProperty('adtpl') ? data.adtpl.replace(/\'/g, '"') : this.resource.adtpl.replace(/\'/g, '"'));
        },
        get: function(material) {
            var ability;
            var data = this.data;
            return (ability = this['get' + $.camelCase(material)]) ? ability.call(this) : data && data[material];
        }
    });

    //本地变量比对象字段可以更好的压缩和混淆
    //以$开头的变量内含异步逻辑，返回一个映射异步值的promise对象
    //通过then方法可以像使用同步值一样使用异步值
    var resource_url = conf.RESOURCE_URL;
    var prefix = conf.PREFIX_CONTAINER;
    var position_url = conf.POSITION_URL;
    var zones_url = conf.ZONES_URL;

    var isMobile = _isMobile();

    var external, local, remote, asyncRemote;
    var allofAds = $.oning({});
    var allOfZones = findZoneIdsInAllOfDivs();


    function findZoneIdsInAllOfDivs() {
        function iteratorForDivIds(x, k, xs) {
            var id = $(x).attr('id');
            return _.indexOf(id, prefix) >= 0 ? id : null;
        }

        function iteratorForZoneIds(divId) {
            return [divId, divId.replace(prefix + '-', '')];
        }

        var divIds = $.map($('div'), iteratorForDivIds);
        return _.map(divIds, iteratorForZoneIds);
    }


    var jiami_resource = base64.base64encode;

    function base64Zones() {
        var zones = allOfZones;
        return zones.length > 0 ?
            jiami_resource((_.map(zones, function(x) {
                return x[1]
            })).join('|')) + '.' + zones.length :
            false;
    }

    function $fetchAllOfAds() {
        return new $.Promise(function(y, n) {
            var zones;

            if (zones = base64Zones()) {
                $.jsonp(
                    zones_url, {
                        zids: zones
                    }, ['callback', '_fl'],
                    function(x) {
                        if (x) {
                            _.assign(allofAds, x);
                            y(allofAds);
                        } else {
                            n(new Error(x.msg));
                        }
                    },
                    true
                )
            }
        })
    }

    function $render(xs) {
        var cityId = xs[0],
            ads = xs[1];

        function handleData(resource, zoneId, divId, cityId) {
            if (!resource.hasOwnProperty('zid'))
                throw new Error(['没有取到', 'zid:', zoneId, '的json文件'].join(''));
            if (resource.zid !== zoneId) throw new Error(['请求的zoneId:' + zoneId + '和', '返回的id:' + resource.zid + '不一致'].join(''))
            var data = new Data(resource, cityId);
            if (!data.data) return;
            render(data, zoneId, divId, cityId, isMobile);

        }
        _.map(allOfZones, function(x) {
            setTimeout(function() {
                handleData(allofAds[x[1]], x[1], x[0], cityId);
            }, 0);
        });
        setTimeout(function() {
            allofAds.trigger('all', allofAds);
        }, 0);

    }

    function render(data, zoneId, divId, cityId, closeView) {
        var html = renderHTML(data.getData(), data.getTpl()); //get htmls
        var beforeReporting = $getUsedProvinceId();

        function updatehref() {
            updateHref(divId, getSearch(zoneId, data.get('aid')));
        }
        preloadImg(data.getImg(), _.partial1(mount, divId, html, beforeReporting, updatehref), _.partial1(report, beforeReporting, data.get('impurl'), data.get('impurl3'), data.get('aid'), zoneId, divId, cityId), closeView);
    }

    function updateHref(divId, search) {
        var target = $('#' + divId).find('a');
        target.attr('href', target.attr('href') + search.replace(/^\?/, '&'));
    }



    function $collectRemoteParams() {
        return asyncRemote = asyncRemote ? asyncRemote : new $.Promise(function(y, n) {
            $.jsonp(position_url, {}, ['cb', '_flpos'],
                function(resource) {
                    if (resource.code == 0) {
                        var provinceId = resource.data.provinceID;
                        var cityId = resource.data.cityID;
                        remote = {};
                        $.setCookie('EMADPOS', (local.cityId || cityId) + '@' + (local.provinceId || provinceId)); //写入本地
                        remote.provinceId = provinceId;
                        remote.cityId = cityId;
                        y(remote);
                    } else {

                    }
                }, true);
        });
    }



    var $beforeRendering = function() {
        var $async;
        return function() {
            return $async ? $async : $async = $.Promise.all([$getUsedCityId(), $fetchAllOfAds()]);
        }
    }();


    function $getUsedCityId() {
        return new $.Promise(function(y, n) {
            if (_.isString(external.cityId) || _.isNumber(external.cityId)) {
                return y(external.cityId);
            }
            if (_.isString(local.cityId) || _.isNumber(local.cityId)) {
                return y(local.cityId);
            }
            return $collectRemoteParams().then(function(value) {
                y(value.cityId);
            })
        });
    }

    function $getUsedProvinceId() {
        return new $.Promise(function(y, n) {
            if (_.isString(external.provinceId) || _.isNumber(external.provinceId)) {
                return y(external.provinceId);
            }
            if (_.isString(local.provinceId) || _.isNumber(local.provinceId)) {
                return y(local.provinceId);
            }
            $collectRemoteParams().then(function(value) {
                y(value.provinceId);
            });
        });
    }


    function renderHTML(data, tpl) {
        return $.compile(tpl)(data);
    }

    function listeningNodeIsInView(node, cb) { //监听一个对象是否在可视区内

        var handdler = function() {
            if ($.isInViewport(node)) {
                cb && cb();
                $(window).off('scroll', handdler).off('resize', handdler);
            }
        };

        $(window).on('scroll', handdler).on('resize', handdler);

    }

    function preloadImg(src, mount, report, closeView) {
        var that = this;
        $.loadImg(src, function() {
            var target = mount();
            if (closeView) {
                report();
            } else {
                setTimeout(function() {
                    //交出线程的控制权给ui，ui结束由事件循环按序执行。
                    if ($.isInViewport(target)) { //如果在可视区，立刻发起请求。
                        report();
                    } else {
                        listeningNodeIsInView(target, report); //如果不在可视区，将request挂载到scrool和resize事件上执行
                    }
                }, 0);
            }
        });
    }

    function mount(id, html, promise, then) {
        var dom = $('#' + id).attr('html', html).css({
            'display': 'block'
        }).get(0);

        promise.then(then);

        return dom;
    }
    var jiami_request = $.bin2hex;
    var random = $.random;
    var loadImg = $.loadImg;

    function report(beforeReporting, url, url3, aid, zid, divId, city_id) {
        beforeReporting.then(function(v) {
            // var search = '?zid=' + zid + '&aid=' + aid + '&' + _.map(statisticalStrategies, strategy).join('&');
            var search = getSearch(zid, aid);
            loadImg(url + search);
        });
        url3 && $.loadImg(url3); //如果有第三方链接，才发送。
    }

    function getSearch(zid, aid) {
        function lazy(thunk) {
            return thunk();
        }
        var ard = jiami_request(_.cat([zid, aid], _.map(statisticalStrategies, lazy)).join('|'));
        var sum = _.reduce(ard, function(s, x) {
            return x = parseInt(x, 10), s + (_.isFiniteNumber(x) ? x : 0);
        }, 0);
        sum = _.slice(sum + '000', 0, 3);
        var atd = (Math.random() + '').replace('.', '') + (new Date().getTime());
        return ['?ard=' + ard + random(0, 9), 'atd=' + atd + sum].join('&');
    }


    function $initParams(opts) {
        external = collectExternalParams(opts);
        local = collectLocalParams();
        if (
            ((_.isString(external.cityId) || _.isNumber(external.cityId)) ||
                (_.isString(local.cityId) || _.isNumber(local.cityId))
            ) &&
            ((_.isString(external.provinceId) || _.isNumber(external.provinceId)) ||
                (_.isString(local.provinceId) || _.isNumber(local.provinceId))
            )
        ) {} else {
            $collectRemoteParams();
        }
    }

    function collectExternalParams(opts) {
        var external = _.clone(opts);
        delete external.userId;
        return external
    }

    function collectLocalParams() {
        var pos = $.getCookie('EMADPOS');
        var posArray;
        var city;
        var province;

        if (pos) { // adms's params
            posArray = pos.split('@');
            city = posArray[0];
            province = posArray[1];
        }

        var params = {
            userId: $.getCookie('EMADGUID'),
            cityId: city || $.getCookie('city_id'),
            provinceId: province || $.getCookie('province_id')
        };

        if (!params.userId) {
            params.userId = $.uuid();
            $.setCookie('EMADGUID', params.userId, 100000);
        }
        return params;
    }

    function update(zoneId, render) {
        if (allofAds[zoneId]) {
            render()
        } else {
            $.listenTo(allofAds, 'all', function(value) {
                if (value && value[zoneId] && value[zoneId].zid == zoneId) {
                    render();
                } else {
                    throw new Error(['not found ads for this zoneId', zoneId].join(':'));
                }
            })
        }
    }

    function __(opts) {
        var called = false;

        function init(opts) {
            if (called) return;
            called = true; //防止外部多次调用

            $initParams(opts);

            //step0:getcityid&fetchAds|getRomoteParams;
            //step1:load img;
            //step2:mount html;
            //step3:getprovinceid|getRemoteParams;
            //step4:report

            $beforeRendering()
                .then($render);

        }
        init.update = function(cityId, zoneId) { //更新广告
            update(zoneId, function() {
                var divId = prefix + '-' + zoneId;
                var resource = allofAds[zoneId];
                if (!resource) throw new Error(['当更新时,没有找到广告数据', zoneId].join(':'));
                if (resource.zid !== zoneId) throw new Error(['当更新时,zoneId不一致', zoneId].join(':'));
                var data = new Data(resource, cityId);
                if (!data.data) throw new Error(['当更新时,此广告位暂时没有广告', zoneId].join(':'));
                render(data, zoneId, divId, cityId, true);
            });
        };
        return init;
    }

    window._emaoad = __();

}(__inline('../conf/conf.js'),
    __inline('../src/common/clojureLike.js')(),
    __inline('../src/common/jQueryLite.js')(),
    __inline('../src/common/isMobile.js'),
    document,
    window,
    __inline('../src/common/base64.js')()
));