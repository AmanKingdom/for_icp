//重写了common.js里的同名函数
zbp.plugin.unbind("comment.reply.start","system");zbp.plugin.on("comment.reply.start","quietlee",function(id){var i=id;$("#inpRevID").val(i);var frm=$('#comt-respond');var cancel=$("#cancel-reply");frm.before($("<div id='temp-frm' style='display:none'>")).addClass("reply-frm");$('#AjaxComment'+i).before(frm);frm.addClass("");cancel.show().click(function(){var temp=$('#temp-frm');$("#inpRevID").val(0);if(!temp.length||!frm.length)return temp.before(frm);temp.remove();$(this).hide();frm.removeClass("");$('.commentlist').before(frm);return false});try{$('#txaArticle').focus()}catch(e){};return false});
//重写GetComments，防止评论框消失
zbp.plugin.on("comment.get","quietlee",function(logid,page){$('.com-page').html("Waiting...")});zbp.plugin.on("comment.got","quietlee",function(){UBBFace();$("#cancel-reply").click()});zbp.plugin.on("comment.post.success","quietlee",function(){$("#cancel-reply").click()});
//UBB
function addNumber(a){document.getElementById("txaArticle").value+=a}
if($('#comment-tools,.msgarticle,.comment-content').length){objActive="txaArticle";function InsertText(a,b,c){if(b==""){return("")}var d=document.getElementById(a);if(document.selection){if(d.currPos){if(c&&(d.value=="")){d.currPos.text=b}else{d.currPos.text+=b}}else{d.value+=b}}else{if(c){d.value=d.value.slice(0,d.selectionStart)+b+d.value.slice(d.selectionEnd,d.value.length)}else{d.value=d.value.slice(0,d.selectionStart)+b+d.value.slice(d.selectionStart,d.value.length)}}}
function ReplaceText(a,b,c){var d=document.getElementById(a);var e;if(document.selection&&document.selection.type=="Text"){if(d.currPos){var f=document.selection.createRange();f.text=b+f.text+c;return("")}else{e=b+c;return(e)}}else{if(d.selectionStart||d.selectionEnd){e=b+d.value.slice(d.selectionStart,d.selectionEnd)+c;return(e)}else{e=b+c;return(e)}}}}
//if($('#ComtoolsFrame').length){$(this).bind("click",function(a){if(a&&a.stopPropagation){a.stopPropagation()}else{a.cancelBubble=true}})}
if($('.face-show').length){$("a.face-show").click(function(){$(".ComtoolsFrame").slideToggle(15)})}
function UBBFace(){if($('.msgarticle,#divNewcomm,#divComments').length){$('.msgarticle,#divNewcomm,#divComments').each(function comreplace(){var a=$(this).html();a=a.replace(/\[B\](.*)\[\/B\]/g,'<strong>$1</strong>');a=a.replace(/\[U\](.*)\[\/U\]/g,'<u>$1</u>');a=a.replace(/\[S\](.*)\[\/S\]/g,'<del>$1</del>');a=a.replace(/\[I\](.*)\[\/I\]/g,'<em>$1</em>');a=a.replace(/\[([A-Za-z0-9]*)\]/g,'<img src="'+bloghost+'/zb_users/theme/quietlee/include/emotion/$1.png" alt="$1.png">');$(this).html(a)})}}UBBFace();
zbp.plugin.on("comment.post.success", "quietlee", function (formData, retString, textStatus, jqXhr){$("#cancel-reply").click();UBBFace()});
/* 归档 */
(function($, window){$(function(){var $a = $('#cundang'),$m = $('.al_mon_list.item h3', $a),$l = $('.al_post_list', $a),$l_f = $('.al_post_list:first,.al_mon_list.item:nth-child(2) ul.al_post_list', $a);$l.hide();$l_f.show();$m.css('cursor', 'pointer').on('click', function(){$(this).next().slideToggle(0);});var animate = function(index, status, s) {if (index > $l.length) {return;}if (status == 'up') {$l.eq(index).slideUp(s, function() {animate(index+1, status, (s-10<1)?0:s-10);});} else {$l.eq(index).slideDown(s, function() {animate(index+1, status, (s-10<1)?0:s-10);});}};$('#al_expand_collapse').on('click', function(e){e.preventDefault();if ( $(this).data('s') ) {$(this).data('s', '');animate(0, 'up', 300);} else {$(this).data('s', 1);animate(0, 'down', 300);}});});})(jQuery, window);
//图片延迟加载
(function($){$.fn.lazyload=function(options){var settings={threshold:0,failurelimit:0,event:"scroll",effect:"show",container:window};if(options){$.extend(settings,options)}var elements=this;if("scroll"==settings.event){$(settings.container).bind("scroll",function(event){var counter=0;elements.each(function(){if($.abovethetop(this,settings)||$.leftofbegin(this,settings)){}else if(!$.belowthefold(this,settings)&&!$.rightoffold(this,settings)){$(this).trigger("appear")}else{if(counter++>settings.failurelimit){return false}}});var temp=$.grep(elements,function(element){return!element.loaded});elements=$(temp)})}this.each(function(){var self=this;if(undefined==$(self).attr("original")){$(self).attr("original",$(self).attr("src"))}if("scroll"!=settings.event||undefined==$(self).attr("src")||settings.placeholder==$(self).attr("src")||($.abovethetop(self,settings)||$.leftofbegin(self,settings)||$.belowthefold(self,settings)||$.rightoffold(self,settings))){if(settings.placeholder){$(self).attr("src",settings.placeholder)}else{$(self).removeAttr("src")}self.loaded=false}else{self.loaded=true}$(self).one("appear",function(){if(!this.loaded){$("<img />").bind("load",function(){$(self).hide().attr("src",$(self).attr("original"))[settings.effect](settings.effectspeed);self.loaded=true}).attr("src",$(self).attr("original"))}});if("scroll"!=settings.event){$(self).bind(settings.event,function(event){if(!self.loaded){$(self).trigger("appear")}})}});$(settings.container).trigger(settings.event);return this};$.belowthefold=function(element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).height()+$(window).scrollTop()}else{var fold=$(settings.container).offset().top+$(settings.container).height()}return fold<=$(element).offset().top-settings.threshold};$.rightoffold=function(element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).width()+$(window).scrollLeft()}else{var fold=$(settings.container).offset().left+$(settings.container).width()}return fold<=$(element).offset().left-settings.threshold};$.abovethetop=function(element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).scrollTop()}else{var fold=$(settings.container).offset().top}return fold>=$(element).offset().top+settings.threshold+$(element).height()};$.leftofbegin=function(element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).scrollLeft()}else{var fold=$(settings.container).offset().left}return fold>=$(element).offset().left+settings.threshold+$(element).width()};$.extend($.expr[':'],{"below-the-fold":"$.belowthefold(a, {threshold : 0, container: window})","above-the-fold":"!$.belowthefold(a, {threshold : 0, container: window})","right-of-fold":"$.rightoffold(a, {threshold : 0, container: window})","left-of-fold":"!$.rightoffold(a, {threshold : 0, container: window})"})})(jQuery);
$(function(){$("img.lazy,.entry-content img,.pic-thumb img").lazyload({placeholder:bloghost+"zb_users/theme/quietlee/style/images/grey.gif",effect:"fadeIn",threshold:200,failurelimit:30})});
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('k.a("\\1 %c \\b\\d\\9\\7\\8\\6 %c i://g.h.j \\1\\1","e: #2; 3: #f; 5:4 0;","3: #2; 5:4 0;");',21,21,'|n|fadfa3|background|5px|padding|u9898|u8fdc|u4e3b|u81f4|log|u5b81||u9759|color|030307|www|talklee|https|com|console'.split('|'),0,{}))
/* AJAX获取第二页内容 */
$(document).on('click','#loadmore a:not(.noajx)',function(){var _this=$(this);var next=_this.attr("href").replace('?ajx=wrap','');$(this).addClass("#loadmore").text("加载中...");$.ajax({url:next,beforeSend:function(){},success:function(data){$('.auto-multi .auto-main').append($(data).find('.auto-list'));nextHref=$(data).find(".auto-multi .loadmore a").attr("href");$("#loadmore a").removeClass("loading").text("点击加载更多");if(nextHref!=undefined){$("#loadmore").removeClass("loading");$(".auto-multi .loadmore a").attr("href",nextHref)}else{$("#loadmore").removeClass("loading");$('#post_over').attr('href','javascript:;').text('没有啦!!!').attr('class','noajx load-more disabled')}},complete:function(){$(".auto-list img").lazyload({placeholder:bloghost+"zb_users/theme/quietlee/style/images/grey.gif",failurelimit:30})},error:function(){location.href=next}});return false});
//点击分享
$("#mClick").click(function(){if(document.getElementById("mClick").className=="mobile_click"){document.getElementById("mClick").className="mobile_close"}else{document.getElementById("mClick").className="mobile_click"}});
//手机导航
jQuery(document).ready(function(){$("<span class='toggle-btn'><i class='fa fa-chevron-down'></i></span>").insertBefore(".sub-menu");$("#list1,#list2,#list3,.widget:nth-child(1),.widget:nth-child(2)").removeClass("wow");$("#list1,#list2,#list3,.widget:nth-child(1),.widget:nth-child(2)").removeClass("fadeInDown");var nav=$(".nav-sousuo");$("#m-nav-so i").click(function(){$(".mini-search").slideToggle()});
$(".m_nav-list i").click(function(){$(".m_nav-list").toggleClass("m_nav-close");$("body.home").toggleClass("cur");$(".sub-menu").toggleClass("m-sub-menu");$(".mobile_nav").toggleClass("mobile_nav_on")});$(".zanter,.rewards-popover-close i").click(function(){$(this).removeClass("primary");$(".rewards-popover-mask,.rewards-popover").toggleClass("primary")});jQuery(".mobile-menu .nav-pills > li,.mobile-menu .nav-pills > li ul li").each(function(){jQuery(this).children(".mobile-menu .m-sub-menu").not(".active").css('display','none');jQuery(this).children(".mobile-menu .toggle-btn").bind("click",function(){$('.mobile-menu .m-sub-menu').addClass('active');jQuery(this).children().addClass(function(){if(jQuery(this).hasClass("active")){jQuery(this).removeClass("active");return""}return"active"});jQuery(this).siblings(".mobile-menu .m-sub-menu").slideToggle()})})});jQuery(document).ready(function($){var datatype=$(".header-nav").attr("data-type");$("#backTop").hide();$('#monavber li').hover(function(){$(this).addClass('on')},function(){$(this).removeClass('on')});$(".nav-pills>li ").each(function(){try{var myid=$(this).attr("id");if("index"==datatype){if(myid=="nvabar-item-index"){$("#nvabar-item-index").addClass("active")}}else if("category"==datatype){var infoid=$(".header-nav").attr("data-infoid");if(infoid!=null){var b=infoid.split(' ');for(var i=0;i<b.length;i++){if(myid=="navbar-category-"+b[i]){$("#navbar-category-"+b[i]+"").addClass("active")}}}}else if("article"==datatype){var infoid=$(".header-nav").attr("data-infoid");if(infoid!=null){var b=infoid.split(' ');for(var i=0;i<b.length;i++){if(myid=="navbar-category-"+b[i]){$("#navbar-category-"+b[i]+"").addClass("active")}}}}else if("page"==datatype){var infoid=$(".header-nav").attr("data-infoid");if(infoid!=null){if(myid=="navbar-page-"+infoid){$("#navbar-page-"+infoid+"").addClass("active")}}}else if("tag"==datatype){var infoid=$(".header-nav").attr("data-infoid");if(infoid!=null){if(myid=="navbar-tag-"+infoid){$("#navbar-tag-"+infoid+"").addClass("active")}}}}catch(E){}});$(".header-nav").delegate("a","click",function(){$(".nav-pills>li").each(function(){$(this).removeClass("active2")});if($(this).closest("ul")!=null&&$(this).closest("ul").length!=0){if($(this).closest("ul").attr("id")=="menu-navigation"){$(this).addClass("active")}else{$(this).closest("ul").closest("li").addClass("active")}}})});
//快捷回复
$(document).keypress(function(e){var s=$('.button');if(e.ctrlKey&&e.which==13||e.which==10){s.click();document.body.focus();return};if(e.shiftKey&&e.which==13||e.which==10)s.click()});
//backtop
$(function(){$("#backtop").each(function(){$(this).find(".top").click(function(){$("html, body").animate({"scroll-top":0},"fast")});$(".bottom").click(function(){$("html, body").animate({scrollTop:$(".footer").offset().top},800);return false})});var lastRmenuStatus=false;$(window).scroll(function(){var _top=$(window).scrollTop();if(_top>500){$("#backtop").data("expanded",true)}else{$("#backtop").data("expanded",false)}if($("#backtop").data("expanded")!=lastRmenuStatus){lastRmenuStatus=$("#backtop").data("expanded");if(lastRmenuStatus){$("#backtop .top").slideDown()}else{$("#backtop .top").slideUp()}}})});
//标签
(function(){var sc=$(document);var tags_a=$("#divTags ul li,#hottags ul li");tags_a.each(function(){var x=10;var y=0;var rand=parseInt(Math.random()*(x-y+1)+y);$(this).addClass("divTags"+rand)})})();
//font
jQuery(document).ready(function($){$('#font-change span').click(function(){var selector='.entry-content p';var increment=1;var font_size=15;var fs_css=$(selector).css('fontSize');var fs_css_c=parseFloat(fs_css,10);var fs_unit=fs_css.slice(-2);var id=$(this).attr('id');switch(id){case'font-dec':fs_css_c-=increment;break;case'font-inc':fs_css_c+=increment;break;default:fs_css_c=font_size}$(selector).css('fontSize',fs_css_c+fs_unit);return false})});
//滚动公告
function Scroll(){}if(document.getElementById("gogo")){Scroll.prototype.upScroll=function(a,c,b){a=document.getElementById(a);var e=setTimeout(function(){a.firstElementChild.style.marginTop=c;clearTimeout(e)},1E3);setInterval(function(){var b=a.firstElementChild;b.style.marginTop="0px";a.appendChild(b);b=a.firstElementChild;b.style.marginTop=c},b)};var myScroll=new Scroll;myScroll.upScroll("gogo","-36px",3E3)};
//加载显示
$(window).scroll(function(){var a=$(window).scrollTop(),c=$(document).height(),b=$(window).height();scrollPercent=a/(c-b)*100;scrollPercent=scrollPercent.toFixed(1);$("#percentageCounter").css({width:scrollPercent+"%"});70<scrollPercent&&$("#navigation").css({top:"0"});70>scrollPercent&&$("#navigation").css({top:"-166px"})}).trigger("scroll");
//sidebar
(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TST: Body width smaller than options.minWidth. Init is delayed.');$(document).scroll(function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).resize(function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;$('head').append($('<style>.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'));$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':'relative','overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginTop=parseInt(o.sidebar.css('margin-top'));o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',0);o.stickySidebar.css('padding-bottom',0);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=0}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=0}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.container.offset().top+(o.paddingTop+o.marginTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+o.marginTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.container.offset().top;var containerBottom=o.container.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop+o.marginTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){o.stickySidebar.css({'position':'fixed','width':o.sidebar.width(),'top':top,'left':o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.top=scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom}css.width=o.sidebar.width();css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).scroll(function(o){return function(){o.onScroll(o)}}(o));$(window).resize(function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'0px'});o.stickySidebar.css({'position':'static','width':''})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}}})(jQuery);
$(document).ready(function(){$('.site-main .side').theiaStickySidebar({additionalMarginTop:15,additionalMarginBottom:15})});
//导航跟随隐藏搜索栏
//$(document).ready(function(){var navOffw=$(".secnav").width();if(navOffw>750){var navOffset=$(".secnav").offset().top;$(window).scroll(function(){var scrollPos=$(window).scrollTop();if(scrollPos>=navOffset){$(".secnav").stop().slideUp()}else{$(".secnav").stop().slideDown()}})}});
$(function() {
    var talkleenav = $(".top-bar");
    var cubuk_seviye = $(document).scrollTop();
    var talklee_top = $(document);
    var header_secnav = $('.fixed-nav').outerHeight();
    $(window).scroll(function() {
        var talklee_fllow = $(document).scrollTop();
        if (talklee_top.scrollTop() >= 0) {
            talkleenav.addClass("fixed-nav");
            $(".navTmp").fadeIn()
        } else {
            talkleenav.removeClass("fixed-nav fixed-enabled fixed-appear");
            $(".navTmp").fadeOut()
        }
        if (talklee_fllow > header_secnav) {
            $('.fixed-nav').addClass('fixed-enabled')
        } else {
            $('.fixed-nav').removeClass('fixed-enabled')
        };
        if (talklee_fllow > cubuk_seviye) {
            $('.fixed-nav').removeClass('fixed-appear')
        } else {
            $('.fixed-nav').addClass('fixed-appear')
        };
        cubuk_seviye = $(document).scrollTop()
    })
});
//导航高亮
$(function(){
	var surl = $(".place a:eq(1)").attr("href");
	var surl2 = location.href;
	var s = document.location;
	$(".nav-pills li a").each(function () {
		if ($(this).attr("href") == surl || $(this).attr("href") == surl2){
			$(this).parent('li').addClass("active");
		};
        if (this.href == s.toString().split("#")[0]) {
            $(this).parent("li").addClass("active");
            $(this).parent().parent().parent("li").addClass("active");
            return false;
        }
	});
});
//阅读模式
(function(a) {
    function c(b) {
        b.removeAttr("style").removeAttr("class").removeAttr("id");
        b = b.children();
        null != b && b.each(function() {
            c(a(this))
        })
    }
    a.fn.easyread = function(b) {
        var e = a.extend({
            contentClass: "none",
            titleClass: "none",
            videoClass: "none"
        },
        b);
        a(this).bind("click",
        function() {
            a("body").css({
                overflow: "hidden"
            });
            a("article").append('\x3cdiv id\x3d"bg_read" style\x3d"position:fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; width: 100%; height: 100%; border: none; margin: 0px; padding: 0px; overflow: hidden; z-index: 99998; background-color: white; opacity: 1; "\x3e\x3cdiv style\x3d"position:absolute; width:32px; height32px; left:50%; top:50%"\x3e\x3cspan class\x3d"loading_read"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e');
            var b = a("." + e.titleClass).text(),
            f = a("." + e.contentClass).clone();
            f.children().each(function() {
                c(a(this))
            });
            b = '\x3cdiv class\x3d"box_read"\x3e\x3cdiv class\x3d"entry-content"\x3e\x3ch1\x3e' + b + "\x3c/h1\x3e" + f.html() + '\x3cdiv style\x3d"clear: both;"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cspan class\x3d"close_read"\x3e\x3c/span\x3e';
            a("#bg_read").append(b);
            a(".title_read").animate({
                marginTop: "5px"
            },
            288);
            a(".loading_read").parent("div").remove();
            a(".close_read").bind("click",
            function() {
                a("#bg_read").fadeOut(288,
                function() {
                    a(this).remove();
                    a("body").css("overflow", "auto")
                });
                return ! 1
            });
            return ! 1
        })
    }
})(jQuery);
$(document).ready(function() {
    $(".read").easyread({
        titleClass: "page-title",
        contentClass: "entry-content",
        videoClass: "entry-video"
    })
});
//判断页面 阅读全文
$(document).ready(function(){
 var navcontop =  $(".entry-content").height();
  //console.log(navcontop);
  if(navcontop <700 ){
   $(".showall").addClass("showwen");
    $(".readtext"). removeClass("readtext");

  }
})
$(function(){
    $('.showall').click(function(){
         $(".readtext").css("height","100%");
         $(".showall").addClass("showwen");
		  $(".showall").html("");
    })
});
//switchNightMode
function switchNightMode(){
    if(zbp.cookie.get('night') == '1' || $('body').hasClass('night')){
        zbp.cookie.set('night','0');
        $('body').removeClass('night');
        console.log('夜间模式关闭');
    }else{
				zbp.cookie.set('night','1');
        $('body').addClass('night');
        console.log('夜间模式开启');
    }
};
//视觉差效果
jQuery(window).bind('scroll', function () {
	$(window).scroll(function() {
		var scrollTop = $(window).scrollTop();
		var paralasicValue = $('.catatop-bg').attr('data-paralasic');
		$('.catatop-bg').css('background-position', '50% ' + scrollTop * paralasicValue + 'px');
	});
});
//视频自适应
jQuery(document).ready(function($){
	$(".entry-content embed, .entry-content video, .entry-content iframe").parent().addClass("p-media");
});
function video_ok(){
	$('.entry-content embed, .entry-content video, .entry-content iframe').each(function(){
		var w = $(this).attr('width'),
			h = $(this).attr('height')
		if( h ){
			$(this).css('height', $(this).width()/(w/h))
		}
	})
}
//文章图片自适应，自适应CSS宽度需设置为width:100%
$(function(){
	$(".entry-content").find("img").css({ //去除style="width:;height:;"
		"width" : "",
		"height" : ""
	});
});
function img_ok(){
	$('.entry-content img').each(function(){
		var w = $(this).attr('width'),
			h = $(this).attr('height')
		if( h ){
			$(this).css('height', $(this).width()/(w/h))
		}
	});
};