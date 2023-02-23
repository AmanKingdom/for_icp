var zbpConfig = {
    bloghost: "https://www.fybk.cc/",
    blogversion: "172995",
    ajaxurl: "https://www.fybk.cc/zb_system/cmd.php?act=ajax&src=",
    cookiepath: "/",
    lang: {
        error: {
            72: "名称不能为空或格式不正确",
            29: "邮箱格式不正确，可能过长或为空",
            46: "评论内容不能为空或过长"
        }
    },
    comment: {
        useDefaultEvents: true,
        inputs: {
            action: {
                getter: function () {
                    return $("#inpId").parent("form").attr("action");
                }
            },
            name: {
                selector: '#inpName',
                saveLocally: true,
                required: true,
                validateRule: /^[^\s　]+$/ig,
                validateFailedErrorCode: 72,
            },
            email: {
                selector: '#inpEmail',
                saveLocally: true,
                validateRule: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ig,
                validateFailedErrorCode: 29,
            },
            homepage: {
                selector: '#inpHomePage',
                getter: function () {
                    var t = $('#inpHomePage').val();
                    return (!/^(.+)\:\/\//.test(t) && t !== "") ? 'http://' + t : t; 
                },
                saveLocally: true
            },
            postid: {
                selector: '#inpId',
                required: true
            },
            verify: {
                selector: '#inpVerify'
            },
            content: {
                selector: '#txaArticle',
                required: true,
                validateRule: /./ig,
                validateFailedErrorCode: 46,
            },
            replyid: {
                selector: '#inpRevID'
            },
            format: {
                getter: function () {return 'json';}
            }
        }
    }
};
var zbp = new ZBP(zbpConfig);

var bloghost = zbp.options.bloghost;
var cookiespath = zbp.options.cookiepath;
var ajaxurl = zbp.options.ajaxurl;
var lang_comment_name_error = zbp.options.lang.error[72];
var lang_comment_email_error = zbp.options.lang.error[29];
var lang_comment_content_error = zbp.options.lang.error[46];

$(function () {

    zbp.cookie.set("timezone", (new Date().getTimezoneOffset()/60)*(-1));
    var $cpLogin = $(".cp-login").find("a");
    var $cpVrs = $(".cp-vrs").find("a");
    var $addinfo = zbp.cookie.get("addinfo");
    if (!$addinfo){
        return ;
    }
    $addinfo = JSON.parse($addinfo);

    if ($addinfo.chkadmin){
        $(".cp-hello").html("欢迎 " + $addinfo.useralias + " (" + $addinfo.levelname  + ")");
        $cpLogin.html("后台管理");
    }

    if($addinfo.chkarticle){
        $cpVrs.html("新建文章");
        $cpVrs.attr("href", zbp.options.bloghost + "zb_system/cmd.php?act=ArticleEdt");
    }
});
$(function(){
  let inpNameVal = $(zbpConfig.comment.inputs.name.selector).val();
  if (typeof inpNameVal === "undefined") {
    return;
  }
  if (inpNameVal.trim() === "" || inpNameVal === "访客"){
    zbp.userinfo.output();
  }
});

window.lcp = {     	  	 	   
            ajaxurl:  ajaxurl + "laycenter&target=",     	 	 			  
            config: {"name":"\u67ab\u53f6\u535a\u5ba2","editor":0,"captcha":"0","captchaId":"","fileBuyTips":"\u786e\u5b9a\u8d2d\u4e70\u5417\uff1f\u8d2d\u4e70\u540e\u81ea\u52a8\u4e0b\u8f7d\uff0c\u53ef\u5728\u7528\u6237\u4e2d\u5fc3\u67e5\u770b\u8ba2\u5355","favBtn":{"collect_button_selector":"","collect_button_location":"before","collect_button_class":"","collect_button_id":"","collect_button_parent_element":"","collect_button_parent_class":"","collect_button_parent_id":""},"notice":{"content":"","type":"0"},"commentCaption":false,"defaultTheme":0,"guestbuy_static_support":0},     		    	  
            url: {"memberCentre":"https:\/\/www.fybk.cc\/MemberCenter","login":"https:\/\/www.fybk.cc\/MemberCenter\/Login.html","register":"https:\/\/www.fybk.cc\/MemberCenter\/Reg.html"},      	 	 		  
            version: "4.7.1",     	   	 	  
            _editorBarButton: {},      		 		   
            editorBarButton: function(n, o){     	 	   	  
                this._editorBarButton[n] = o;      		 	 	  
            },     	 	 		   
            captcha: function(done, cancel){      		      
                switch (lcp.config.captcha) {     	    		  
                    case "1":      		   	  
                        new TencentCaptcha(lcp.config.captchaId, function(r) {     			   	  
                            if (r.ret === 0){     	  		    
                                zbp.cookie.set("captchaTicket", r.ticket);     	 	 	 	  
                                zbp.cookie.set("randstr", r.randstr);     	  	 		  
                                done && done();     	   	    
                            }else if(r.ret === 2){     			 		   
                                cancel && cancel();      		      
                            }     	 	 		   
                        }).show();     			      
                        break;      			     
                    case "2":     	   			  
                        $("body").append(`<div id=vaptchaContainer></div>`);     		    	  
                        var a = layer.msg("正在加载图形验证...",{icon:16,time:false,shade:.2});     	 		     
                        vaptcha({     				  	  
                            vid: lcp.config.captchaId,     			 			  
                            type: "invisible",     	 		  	  
                            container: "#vaptchaContainer",     			  		  
                        }).then(function (o) {      		 	 	  
                            layer.close(a);     	  			   
                            o.validate();      		 	 	  
                            $("#vaptchaContainer").remove();     	 	 	 	  
                            o.listen("pass", function() {     				  	  
                                zbp.cookie.set("captchaTicket",o.getToken());     	 	 	    
                                o.reset();     	    		  
                                done && done();      			  	  
                            });     	 	 	    
                            o.listen("close", function () {      			  	  
                                o.reset();     	 	  		  
                                cancel && cancel();     	 	 	 	  
                            });      		   	  
                        });     	 	  	   
                        break;     		  	 	  
                    default:     			 	    
                        done && done();     		 			   
                        break;     	 	 			  
                }     		 	 	   
            }     		   	   
        };     	 	 	    
        
