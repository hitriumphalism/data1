目录结构

1.共分为三个部分

	a.配置代码conf.js
	b.基础设施
		通用、兼容代码:jQueryLite.js,clojureLike.js
	c.业务代码

2.jQueryLite模仿了jQuery的语法

3.clojureLike模仿了clojure的语法

开发测试上线步骤

搭建了多个本地开发环境，代码环境切换0修改


1.前端本地环境mockmock假数据 sh fedev.sh

2.jsonp接口数据 sh jsonpdev.sh

3.后台本地环境 sh rddev.sh

4.上线 sh build.sh
