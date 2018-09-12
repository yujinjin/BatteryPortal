/**
 * 作者：yujinjin9@126.com
 * 时间：2018-03-06
 * 描述：商品详情
 */
import "../site";
import "../lib/jqzoom/jquery.jqzoom";
import "../../style/product-details.less";
import "../lib/jqzoom/jquery.jqzoom.css";

$(function(){
	let productDetails = {
		init(){
			$(".sku-wrap a").on("click", function(e){
				if(!$(this).hasClass("active")) {
					$(".sku-wrap a.active").removeClass("active");
					$(this).addClass("active");
					$(".jqzoom > img").attr("src", $(this).find("img").attr("src"));
					$(".jqzoom > img").attr("jqimg", $(this).find("img").attr("jqimg"));
				}
			});
			$(".spec-scroll > .control").on("click", function(e){
				if($(".sku-wrap li").length === 1) return;
				if($(this).hasClass(".prev")) {
					// 上一个
					if($(".sku-wrap a.active").parent("li").prev("li").length == 1){
						$(".sku-wrap a.active").parent("li").prev("li").find("a").trigger("click");
					} else {
						$(".sku-wrap li:last").find("a").trigger("click");
					}
				} else {
					// 下一个
					if($(".sku-wrap a.active").parent("li").next("li").length == 1){
						$(".sku-wrap a.active").parent("li").next("li").find("a").trigger("click");
					} else {
						$(".sku-wrap li:first").find("a").trigger("click");
					}
				}
			});
			$(".jqzoom").jqueryzoom({xzoom:250,yzoom:250});
//			$('.jqzoom').jqzoom({
//              zoomType: 'standard',
//				lens: true,
//				preloadImages: false,
//				alwaysOn: false,
//				zoomWidth: 250,
//				zoomHeight: 250,
//				xOffset: 120,
//				yOffset: 30,
//		        title: false
//          });
		}
	}
	productDetails.init();
});