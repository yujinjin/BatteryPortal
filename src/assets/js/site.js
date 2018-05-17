/**
 * 作者：yujinjin9@126.com
 * 时间：2018-03-15
 * 描述：站点框架初始化
 */
import components from "./components";
import log from "./utils/log";
import utils from "./utils/utils";
import {ajax, ajaxMock} from "./services/ajax";
import api from "./services/api";
import "../style/site.css";
import "../style/footer.css";
import "../style/header.css";
import "../style/icon.css";

const site = {
	config: {
		contextPath: "/", //项目相对路径
	    uploadImgServer: "", //图片上传服务
	    webapiDomain: "", //项目相对路径
	    projectPath: "", //项目全路径
	    resourecePath: "/assets", //资源路径
	    mobilePath: "", //移动端全路径
	    isDebug: (!process.env.NODE_ENV && process.env.NODE_RUN !== "0"), //前端是否调试模式
	    isRelease: (process.env.NODE_RUN === "1"), //是否发布环境
	    version: "0.0.3" //版本号
	},
	//获取站点本地存储信息
	getSiteLocalStorage: function () {
		var _site_local_storage = site.utils.localStorage("siteLocalStorage");
		if (_site_local_storage) {
			try {
				_site_local_storage = JSON.parse(_site_local_storage);
			} catch (e) {
				site.log.error(e);
			}
		}
		if (_site_local_storage == null || typeof (_site_local_storage) != "object") {
			_site_local_storage = {};
		}
		return _site_local_storage;
	},
	
	//设置站点本地存储信息
	setSiteLocalStorage: function(key, value){
		var _site_local_storage = this.getSiteLocalStorage();
		if(value) {
			_site_local_storage[key] = value;
		} else {
			delete _site_local_storage[key];
		}
		site.utils.localStorage("siteLocalStorage", JSON.stringify(_site_local_storage));
	}
};
Object.keys(components).forEach((key) => {
    site[key] = components[key];
});
site.config = Object.assign(site.config, config);
if(site.config.isDebug){
	log.level = log.levels.DEBUG;
}
window.site = $.extend(true, site, {log, utils, ajax, ajaxMock, api});

// 系统页面初始化
$(function(){
	var controller = {
        init: function () {
        	this.initHeader();
        	this.initPage();
        },
        initHeader(){
			// 初始化菜单底部线条
			let _url_file = utils.parseUrl(window.location.href).file;
			if(_url_file) {
				$(".nav").find("li.on").removeClass("on");
				$(".nav").find("li[data-file='" + _url_file + "']").addClass("on");
			}
			
			if($(".nav").find("li.on").length > 0) {
				$(".nav").find(".nav-icon").css({
					left: $(".nav").find("li.on").position().left + 40,
					width: $(".nav").find("li.on").width()
				});
			}
			// 初始化菜单光标移动事件
			$(".nav").find("li").hover(function() {
		        var left = $(this).position().left + 40;
		        $(".nav").find(".nav-icon").stop().animate({
		            left: left,
		            width: $(this).width()
		        }, 400);
		    }, function() {
		    	if($(".nav").find("li.on").length > 0) {
		    		var left = $(".nav").find("li.on").position().left + 40;
			        $(".nav").find(".nav-icon").stop().animate({
			            left: left
			        }, 300);
		    	} else {
		    		$(".nav").find(".nav-icon").stop().animate({
			            width: 0
			        }, 300);
		    	}
		    });
		    
		    // 初始化二维码关注我们
		    $(".ewm").hover(function() {
        		$(this).find("img").show();
    		}, function() {
        		$(this).find("img").hide();
    		});
		},
		//系统初始化页面HTML
		initPage: function() {
		    //隐藏页面加载提示
		    // 其处理逻辑是如果.1S内页面还没加载完，就显示loading加载动画，如果.1s内就加载完了就不会显示loading动画
		    if(!$('.loading-container').hasClass('hidden')) {
	    		$('.loading-container').addClass('hidden');
	    	}
		},
    }
	controller.init();
});

