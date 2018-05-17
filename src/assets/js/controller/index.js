/**
 * 作者：yujinjin9@126.com
 * 时间：2018-03-06
 * 描述：站点首页
 */
import "../site";
import "../lib/jquery.easing.1.3"
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import "../../style/home.css";

$(function(){
	var home = {
		isScrolling: false, // 当前滚动条是否在滚动，如果是正在滚动时不要触发滚动事件
		init: function(){
			this.binEvent();
		},
		
		binEvent: function(){
    		// 初始化swiper
    		var swiper = new Swiper('.swiper-container', {
    			loop : true,
    			autoplay: {
				    delay: 3000,
				    stopOnLastSlide: true,
				    disableOnInteraction: true
			    },
		      	pagination: {
		        	el: '.swiper-pagination'
		      	}
    		});
    		// window 滚动事件,设置左边导航栏位置
    		var sectionTops = [], headerHeight = $("header").outerHeight(), _this = this;
    		$(".section[data-index]").each(function(index, sectionItem){
    			sectionTops.push($(sectionItem).offset().top - headerHeight)
    		});
    		$(window).scroll(function(e) {
    			if(_this.isScrolling) {
    				e.stopPropagation();
    				e.preventDefault();
    				return;
    			}
    			for(var i = 0; i < sectionTops.length; i++){
    				if(sectionTops[i] < $(window).scrollTop() + $(window).height()) {
    					_this.setNavRightActive(i);
    					_this.sectionAnimate(i);
    				} else {
    					break;
    				}
    			}
    		});
    		$(window).trigger("scroll");
		},
		
		// 滚动到指定section, index从0开始
		scrollToSection: function(index){
			var $section = $(".section[data-index=" + index + "]"), _this = this;
			this.isScrolling = true;
			$('html,body').animate({
        		scrollTop: $section.offset().top
    		}, 500, null, function(){
    			_this.isScrolling = false;
    		});
    		this.setNavRightActive(index);
			this.sectionAnimate(index);
		},
		
		// 设置右边导航栏激活
		setNavRightActive: function(index){
			var $target = $(".nav-right-pagination").find("a[data-index=" + index + "]");
			var $active = $(".nav-right-pagination").find("a.active");
			if($active[0] === $target[0]){
				return;
			}
			$active.removeClass("active");
			$target.addClass("active");
		},
		
		// section动画
		sectionAnimate(index){
			var $section = $(".section[data-index=" + index + "]");
			if($section.attr("isLoaded") === "true"){
				return;
			}
			var speed = 1500, delay = 0;
			if(index === 1) {
				// 第二屏的动画
				$section.find('.service-scope').delay(delay).animate({
			        top: '0'
			    }, speed, 'easeOutExpo');
			    $section.find('.service-text').delay(delay).animate({
			        left: '0'
			    }, speed, 'easeOutExpo');
			    $section.find('.service-row').delay(delay).animate({
			        bottom: '0'
			    }, speed, 'easeOutExpo');
			} else if(index === 2) {
				// 第三屏的动画
				$section.find('.succeed-title').css({
                    position: "relative"
                }).delay(delay).animate({
                    top: '0'
                }, speed, 'easeOutExpo');
                $section.find('.succeed-text').css({
                    position: "relative"
                }).delay(delay).animate({
                    left: '0'
                }, speed, 'easeOutExpo');
                $section.find('.cases-row').css({
                    position: "relative"
                }).delay(delay).animate({
                    bottom: '0'
                }, speed, 'easeOutExpo');
			} else if(index === 3) {
				// 第四屏的动画
				$section.find('.solutions-title').css({
                    position: "relative"
                }).delay(delay).animate({
                    left: '0'
                }, speed, 'easeOutExpo');
                $section.find('.solutions-text').css({
                    position: "relative"
                }).delay(delay).animate({
                    right: '0'
                }, speed, 'easeOutExpo');
                $section.find('.solutions-panel').css({
                    position: "relative"
                }).delay(delay).animate({
                    top: '0'
                }, speed, 'easeOutExpo');
			} else if(index === 4) {
				// 第五屏的动画
				$section.find('.partner-title').delay(delay).animate({
                    opacity: 1
                });
                $section.find('.partner-text').delay(delay).animate({
                    opacity: 1
                });
                $section.find('.partner-row').delay(delay).animate({
                    opacity: 1
                });
			}
			$section.attr("isLoaded", "true");
		}
	}
	home.init();
});
