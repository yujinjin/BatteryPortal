/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-29
 * 描述：交互式数据请求
 */
import modal from "../components/modal";

module.exports = {
	// ajax请求 添加：handleSendData、successFunData、loading参数
	ajax(options){
		if ($.isFunction(options.abpServiceProxiesFun)) {
	        var _abpServiceProxiesFun = options.abpServiceProxiesFun, _inputParams = options.inputParams;
	        delete options.abpServiceProxiesFun;
	        if (typeof (options.inputParams) === "undefined") {
	            return _abpServiceProxiesFun(options);
	        } else {
	            delete options.inputParams;
	            _inputParams.push(options);
	            return _abpServiceProxiesFun.apply(null, _inputParams);
	        }
	    }
	    var defaults = {
	        type: "POST",
	        dataType: "json",
	        data: {},
	        contentType: 'application/json',
	        loading: true, //是否加载，可以是一个对象{blockUI: false}
	        handleSendData: null, //是否处理发送参数
	        successFunData: true, //是否验证成功数据
	        isJsonParmets: true, //是否序列化参数
	        error: function (xhr, errorType, error) {
	            if (xhr.responseJSON && xhr.responseJSON.__abp && xhr.responseJSON.error && xhr.responseJSON.error.message) {
	                if (xhr.responseJSON.error.validationErrors) {
	                    var validationErrors = xhr.responseJSON.error.validationErrors;
	                    var messages = "";
	                    for (var i = 0; i < validationErrors.length; i++) {
	                        messages = messages + validationErrors[i].message + " ";
	                    }
	                    
	                    modal.error(messages);
	                } else {
	                    modal.error(xhr.responseJSON.error.message);
	                }
	            } else {
	                modal.error("服务出错了,请刷新页面重新操作!");
	            }
	            log.debug(xhr, errorType, error);
	        }
	    }, _loading = null;
	    var _options = $.extend(true, {}, defaults, options);
	    if ($.isFunction(options.handleSendData)) {
	        _options.data = options.handleSendData(_options.data);
	    }
	    //只有get请求不需要序列化
	    if (typeof (_options.data) === "object" && (!_options.type || _options.type.toLowerCase() !== "get")) {
	        _options.data = JSON.stringify(_options.data);
	    }
	    _options.beforeSend = function (xhr) {
	        //xhr.setRequestHeader("X-XSRF-TOKEN", site.globalService.getAntiForgeryToken());
	        if ($.isFunction(options.beforeSend)) {
	            options.beforeSend(xhr);
	        }
	        if (_options.loading) {
	            _loading = loading.showLoading(_options.loading);
	        }
	    }
	
	    _options.complete = function (xhr, status) {
	        //site.hidePreloader();
	        if ($.isFunction(options.complete)) {
	            options.complete(xhr, status);
	        }
	        if (_loading) {
	            loading.hideLoding(_loading);
	        }
	    }
	    _options.success = function (data) {
	        var _data = data;
	        if (_options.successFunData === true) {
	            if (data.success) {
	                _data = data.result;
	            } else if (data.error && data.error.message) {
	                modal.error(data.error.message);
	                return;
	            } else {
	                modal.error("出错了！");
	                return;
	            }
	        }
	        if ($.isFunction(options.success)) {
	            options.success(_data);
	        }
	        if (data && data.targetUrl) {
	            location.href = data.targetUrl;
	        }
	    }
	    return $.ajax(_options);
	},
	
	// 数据模拟
	ajaxMock(options, data){
		var def = $.Deferred();
		var _data = data;
        if (options.successFunData !== false) {
            if (data.success) {
                _data = data.result;
            } else if (data.error && data.error.message) {
                modal.error(data.error.message);
                return;
            } else {
                modal.error("出错了！");
                return;
            }
        }
		def.resolve(_data);
		if(options && options.success) {
			options.success(_data);
		}
		return def.promise();
	}
}