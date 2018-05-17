/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：用户中心API接口
 */
module.exports = {
	//登录用户
    "login": function(ajaxOptions) {
    	return site.ajaxMock(ajaxOptions, require("../../data/login.json"));
//      	return site.ajax($.extend({
//	            url: site.config.contextPath + "/assets/js/data/login.json",
//	        }, ajaxOptions));
    }
}
