/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * 描述：站点页面表单验证框架工具类
 */
export default {
	//日期格式化
	dateFormat(date, fmt){
		// TODO: 没有经过测试
		if(!date || !date instanceof Date) {
			return "";
		}
		if(!fmt) {
			fmt = "yyyy-MM-dd";
		}
		var o = {
			"M+": date.getMonth() + 1, // 月份
			"d+": date.getDate(), // 日
			"h+": date.getHours(), // 小时
			"m+": date.getMinutes(), // 分
			"s+": date.getSeconds(), // 秒
			"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
			"S": date.getMilliseconds() // 毫秒
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	
	/** 
	 * 将数值四舍五入(保留2位小数)后格式化成金额形式 
	 * 
	 * @param num 数值(Number或者String) 
	 * @param digit 保留小数点几位
	 * @return 金额格式的字符串,如'1,234,567.45' 
	 * @type String 
	 */
	//货币格式化
	dateCurrency(num, digit) {
		num = num.toString().replace(/\$|\,/g, '');
		if(isNaN(num))
			num = "0";
		if(typeof(digit) != "number" || digit < 0){
			digit = 0;
		}
		//最大支持11位小数
		if(digit > 11){
			return;
		}
		// 绝对值
		var sign = (num == (num = Math.abs(num))), cents = null;
		num = Math.floor(num * Math.pow(10, digit) + 0.50000000001);
		if(digit > 0){
			//小数位
			cents = num % Math.pow(10, digit);
			cents = ( "00000000000" + num).substr(-digit)
		}
		num = Math.floor(num / Math.pow(10, digit)).toString();
		for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
				num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		if(cents) {
			return (((sign) ? '' : '-') + num + '.' + cents);
		} else {
			return (((sign) ? '' : '-') + num);
		}
	},
	
	//将数字转换成大写汉字
	changeNumMoneyToChinese(money) {
		var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
		var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
		var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
		var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
		var cnInteger = "整"; //整数金额时后面跟的字符
		var cnIntLast = "元"; //整型完以后的单位
		var maxNum = 999999999999999.9999; //最大处理的数字
		var IntegerNum; //金额整数部分
		var DecimalNum; //金额小数部分
		var ChineseStr = ""; //输出的中文金额字符串
		var parts; //分离金额后用的数组，预定义
		if(money == "") {
			return "";
		}
		money = parseFloat(money);
		if(money >= maxNum) {
			alert('超出最大处理数字');
			return "";
		}
		if(money == 0) {
			ChineseStr = cnNums[0] + cnIntLast + cnInteger;
			return ChineseStr;
		}
		money = money.toString(); //转换为字符串
		if(money.indexOf(".") == -1) {
			IntegerNum = money;
			DecimalNum = '';
		} else {
			parts = money.split(".");
			IntegerNum = parts[0];
			DecimalNum = parts[1].substr(0, 4);
		}
		if(parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
			var zeroCount = 0;
			var IntLen = IntegerNum.length;
			for(var i = 0; i < IntLen; i++) {
				var n = IntegerNum.substr(i, 1);
				var p = IntLen - i - 1;
				var q = p / 4;
				var m = p % 4;
				if(n == "0") {
					zeroCount++;
				} else {
					if(zeroCount > 0) {
						ChineseStr += cnNums[0];
					}
					zeroCount = 0; //归零
					ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
				}
				if(m == 0 && zeroCount < 4) {
					ChineseStr += cnIntUnits[q];
				}
			}
			ChineseStr += cnIntLast;
			//整型部分处理完毕
		}
		if(DecimalNum != '') { //小数部分
			var decLen = DecimalNum.length;
			for(var i = 0; i < decLen; i++) {
				var n = DecimalNum.substr(i, 1);
				if(n != '0') {
					ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
				}
			}
		}
		if(ChineseStr == '') {
			ChineseStr += cnNums[0] + cnIntLast + cnInteger;
		} else if(DecimalNum == '') {
			ChineseStr += cnInteger;
		}
		return ChineseStr;
	},
	
	parseUrl(url) {
		if(!url) {
			return;
		}
		var _a_el = document.createElement("a");
		_a_el.href = url;
		return {
			protocol: _a_el.protocol.replace(':', ''), //协议
			host: _a_el.hostname, //域名
			port: _a_el.port,
			query: (function() {
				if(_a_el.search) {
					return _a_el.search;
				}
				//兼容http://xxxx/#/id=xxx这种格式
				if(url.indexOf("?") != -1) {
					return url.substring(url.indexOf("?"));
				}
				return "";
			})(),
			params: (function() {
				var ret = {},
					seg = _a_el.search;
				//兼容http://xxxx/#/id=xxx这种格式
				if(!seg && url.indexOf("?") != -1) {
					seg = url.substring(url.indexOf("?"));
				}
				seg = seg.replace(/^\?/, '').split('&');
				var len = seg.length,
					i = 0,
					s;
				for(; i < len; i++) {
					if(!seg[i]) {
						continue;
					}
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(), //参数对象
			file: (_a_el.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
			hash: _a_el.hash.replace('#', ''),
			path: _a_el.pathname.replace(/^([^\/])/, '/$1'),
			relative: (_a_el.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
			segments: _a_el.pathname.replace(/^\//, '').split('/')
		}
	},
	
	generateGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	
	//本地存储
	localStorage(key, value) {
		if(arguments.length === 0) {
			site.log.warn("没有参数");
			return;
		}
		if(arguments.length === 1 || typeof(value) === "undefined") {
			return window.localStorage.getItem(key);
		} else if(value === null || value === '') {
			window.localStorage.removeItem(key);
		} else if(typeof(value) === "object") {
			window.localStorage.setItem(key, JSON.stringify(value));
		} else {
			window.localStorage.setItem(key, value);
		}
	},
	
	/* Creates a name namespace.
    *  Example:
    *  var taskService = abp.utils.createNamespace(abp, 'services.task');
    *  taskService will be equal to abp.services.task
    *  first argument (root) must be defined first
    ************************************************************/
    createNamespace(root, ns) {
        var parts = ns.split('.');
        for (var i = 0; i < parts.length; i++) {
            if (typeof root[parts[i]] == 'undefined') {
                root[parts[i]] = {};
            }
            root = root[parts[i]];
        }
        return root;
    },
    
    extend(target, ...sources){
    	return Object.assign(target, ...sources);
    },
    
    //动态加载JS
	loadScript(url, id, callback) {
		//如果URL不存在或者该ID已经加载过了
		if(!url || document.getElementById(id)) return;
		var script = document.createElement("script");
		script.type = "text/javascript";
		if(id) script.id = id;
		if(typeof(callback) == "function") {
			//默认10S超时就立即执行回调函数
			let timer = setTimeout(function(){
				callback(false);
				timer = null;
			}, 10000);
			if(script.readyState) {
				script.onreadystatechange = function() {
					if(script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						if(timer){
							clearTimeout(timer);
							callback(true);
						}
					}
				};
			} else {
				script.onload = function() {
					if(timer){
						clearTimeout(timer);
						callback(true);
					}
				};
			}
		}
		script.src = url;
		document.body.appendChild(script);
	}
}
