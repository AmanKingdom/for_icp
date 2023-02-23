layui.config({
    base: bloghost + 'zb_users/plugin/LayCenter/static/layuiAdmin/controller/',
    version: lcp.version,
}).use(['widget'], function () {
    var widget = layui.widget,
        pid = $('meta[name=pid]').attr('content'),
        b = $('body');
    
    var events = {
        signin: function(){
            var a = $(this);
            a.find('span').length > 0 ? widget.ajax({
                url: lcp.ajaxurl + 'signin',
                loadMessage: '正在签到...',
                success: function(r){
                    r.code == 1 && (a.find('span').remove(),$('.update-price').text(r.data.p)),
                    layer.alert(r.msg,{icon:r.code});
                }
            }) : location.hash = '/User/SignIn';
        },
        buy: function(){
            lcp.buy($(this).data('id'),function(r){
                layer.msg(r.msg,{icon:1});
                $('.lcphidebox .lcp-body').html(r.data.content);
                $('.lcphidebox .balance span').text(r.data.balance);
            });
        },
        download: function(){
            var tips = lcp.config.fileBuyTips,t = $(this);
            
            function d(e){
                lcp.buy(e.data('id'),function(r){
                    layer.alert('购买成功，页面刷新后即可下载。',{icon:1,closeBtn:false},function(){
                        location.reload();
                    });
                });
            }
            
            if (tips !== '' && !t.hasClass('purchased')){
                var l = layer.confirm(tips, {
                    btn: [t.text(),'取消']
                }, function(){
                    layer.close(l),
                    d(t);
                });
            }else{
                d(t);
            }
        },
        openin_hide_iframe: function(){
            layer.msg('已请求下载...',{icon:1});
            let e = document.createElement("iframe");   
            e.src = $(this).data('url');   
            e.style.display = "none";   
            document.body.appendChild(e);
        },
        logout: function(){
            var s = '正在注销...';
            widget.ajax({
                url: lcp.ajaxurl+'logout',
                loadMessage: s,
                data: {
                    real:1
                },
                complete:function(r){
                    location.href = bloghost;
                }
            });
        }
    },commentCaptcha = function(){
        zbp.options.comment.inputs.lcp_tverify = {
        	required: true,
        	validateOnly: true,
        	getter: function () {
        		return '';
        	},
        	validator: function (text, callback) {
                if (!zbp.cookie.get('captchaTicket')){
                    lcp.captcha(function(){
                        zbp.comment.post();
                    });
                    throw new Error('请进行图形验证');
                }else{
        			callback(null);
        		}
        	}
        };
    },guestBuyBox = function(id, data){
        var a,e,t,v,
            s = `
            <div class="invest" style="display:none">
                <div class="invite-notice"></div>
                <div class="layui-tab" id="guestbuy-box-payment">
                    <ul class="payment-title"></ul>
                    <div class="payment-content">
                        <div class="payment-content-item" data-type="qrpay" style="display:none">
                            <div class="codepay">
                                <div class="mod_pay">
                                    <ul class="pay_bar"></ul>
                                    <div class="pay_figure">
                                        <div class="figure">
                                            <div class="figure_pic_wp"></div>
                                            <h6 class="figure_title">手机扫一扫支付</h6>
                                        </div>
                                        <div class="detail">
                                            <div class="price">
                                                支付金额：<span class="rmb">￥</span><strong class="strong paymoney">${data.money}</strong><span class="txt">元</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="payment-content-item" data-type="urlpay" style="display:none">
                            <div class="url_pay">
                                <div class="detail">
                                    <div class="price">
                                        支付金额：<span class="rmb">￥</span><strong class="strong paymoney">${data.money}</strong><span class="txt">元</span>
                                    </div>
                                </div>
                                <div class="paybtn urlpayitem"></div>
                                <div class="urlpaybtn">
                                    <a class="layui-btn layui-btn-primary" id="guestbuy-url-pay" href="javascript:;">立即支付</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        
        !function(){
            b.children('.invest').remove();
            b.append(s);
            
            e = $('#guestbuy-box-payment'),
            t = e.find('.payment-title');
            
            var p = data.payment;
            
            if (p.qrpay){
                t.append('<li data-type="qrpay" class="on"><i class="iconfont icon-erweima"></i> 扫码支付</li>'),
                e.find('[data-type="qrpay"]').show();
                layui.each(p.qrpay, function(i, v){
                    e.find('.pay_bar').append(`<li class="item ${i?'':'current'}" data-id="${v.id}"><img src="${v.icon}" class="logo"><span class="txt">${v.name}</span></li>`)
                });
            }else{
                e.find('[data-type="qrpay"]').remove();
            }
            
            if (p.urlpay){
                t.append(`<li data-type="urlpay" class="${p.qrpay?'':'on'}"><i class="iconfont icon-wangye"></i> 网页支付</li>`);
                p.qrpay || e.find('[data-type="urlpay"]').show();
                layui.each(p.urlpay, function(i, v){
                    e.find('.urlpayitem').append(`<span class="item"><input type="radio" name="urlpaychoose" ${i?'':'checked'} value="${v.id}" id="urlpayid${v.id}"><label for="urlpayid${v.id}"><img src="${v.icon}" class="logo">${v.name}</label></span>`)
                });
            }else{
                e.find('[data-type="urlpay"]').remove();
            }
            
            $('.invite-notice').html(data.notice.replace(/\n/g,'<br>'));
        }();
        
        function check(n){
            clearInterval(v);
            v = setInterval(function(){
                lcp.tradeCheck(n,null,function(){
                    clearInterval(v),
                    layer.close(a);
                    a = layer.alert('支付成功',{icon:1},function(){
                        layer.close(a),
                        guestBuySucceed();
                    });
                });
            },5e3);
        }
        
        function pay(){
            var payType = t.find('.on').data('type'),
                qrdom = e.find('.figure_pic_wp'),
                payment;
            if (payType == 'qrpay'){
                payment = e.find('.pay_bar .current').data('id');
            }else{
                payment = e.find('[name=urlpaychoose]:checked').val();
            }
            
            qrdom.empty(),
            widget.ajax({
                url: lcp.ajaxurl + 'guestBuyArticle',
                data:{
                    id,
                    payType,
                    payment
                },
                type: 'post',
                loadMessage: payType == 'qrpay' ? false : '正在创建订单...',
                success: function(r){
                    var u,d = r.data,
                        p = lcp.AlipayQRCodeTips,
                        f = `二维码加载失败`;
                    if (r.code == 1){
                        if (d.qrUrl){
                            layui.img(u = d.qrUrl,function(){
                                qrdom.html(`<img src="${d.qrUrl}">`),p(qrdom,u,r),
                                check(d.trade);
                            },function(){
                                clearInterval(v);
                                qrdom.text(f);
                            });
                        }else if(u = d.qrData){
                            layui.use(['qrcode'],function(){
                                var qrcode = layui.qrcode;
                                new qrcode(qrdom[0], {
                                    text: d.qrData,
                                    width: 150,
                                    height: 150,
                                    colorDark : "#000000",
                                    colorLight : "#ffffff",
                                    correctLevel : qrcode.CorrectLevel.H
                                }),p(qrdom,u,r),
                                check(d.trade);
                            });
                        }else{
                            var u = d.url || d.html;
                            u && lcp.open(u, '打开支付页面', function(){
                                lcp.questionPaySuccess(function(){
                                    var n = 0;
                                    function c(){
                                        n++;
                                        lcp.tradeCheck(d.trade, '正在检查订单...',function(){
                                            layer.close(a);
                                            a = layer.alert('支付成功',{icon:1},function(){
                                                layer.close(a),
                                                guestBuySucceed();
                                            });
                                        },function(){
                                            layer.alert('后台未检测到付款成功'+(n>2?'<br>如果您确实已付款成功，可稍后到此页面查看内容':''),{icon:0,btn:['重新检查']},c);
                                        });
                                    }
                                    c();
                                });
                            });
                        }
                    }else{
                        clearInterval(v);
                        qrdom.text(f);
                        layer.msg(r.msg, function(){});
                    }
                }
            });
        }
        
        a = layer.open({
            type: 1,
            title: false,
            shade: 0.2,
            area: ['600px', '500px'],
            skin:'invest-box invest-box-guest',
            content: $('.invest'),
            success: function(){
                var c = e.find('.payment-content');
                
                t.on('click','li',function(){
                    if ($(this).hasClass('on')){
                        return;
                    }
                    $(this).addClass('on'),
                    $(this).siblings().removeClass('on');
                    c.children().hide();
                    c.children(':eq('+$(this).index()+')').show();
                    $(this).data('type') == 'qrpay' ? pay() : clearInterval(v);
                });
                
                !function(t){
                    var n = t.next();
                    t.data('type') == 'qrpay' && /mobile/i.test(navigator.userAgent) && n.length && n.data('type') == 'urlpay' && n.click()
                }($('#guestbuy-box-payment ul .on'));
                
                e.find('.pay_bar li').click(function(){
                    if ($(this).hasClass('current')){
                        return;
                    }
                    $(this).addClass('current'),
                    $(this).siblings().removeClass('current');
                    pay();
                });
                
                t.find('.on').data('type') == 'qrpay' && pay();
                
                $('#guestbuy-url-pay').click(pay);
            },
            cancel: function(){
                clearInterval(v);
            }
        });
    },guestBuySucceed = function(){
        if (lcp.config.guestbuy_static_support){
            lcp.loadBody(lcp.ajaxurl+'loadpjaxpost&id='+pid);
        }else{
            location.reload();
        }
    };
    
    // 免登录购买静态缓存支持
    !function(d,i){
        d && i && widget.ajax({
            url: lcp.ajaxurl + 'checkpostpay&id='+i,
            loadMessage:false,
            success: function(r){
                r.data && guestBuySucceed();
            }
        });
    }(lcp.config.guestbuy_static_support, pid);
    
    // 初始化评论提交图形验证
    lcp.config.commentCaption && commentCaptcha();
    
    // 收藏按钮
    !function(c){
        var p = c.collect_button_parent_element;
        function r(fn,c){
            widget.ajax({
                url: lcp.ajaxurl + 'collect&' + (c?'check':''),
                data: {article: pid},
                loadMessage: false,
                error:function(){return c},
                success: fn
            });
        }
        if (pid && c.collect_button_selector){
            r(function(r){
                $(c.collect_button_selector)[c.collect_button_location]((p&&`<${p} class="${c.collect_button_parent_class||''}" id="${c.collect_button_parent_class||''}">`) + `<a href="javascript:;" class="lcp-add-fav ${c.collect_button_class||''}" id="${c.collect_button_id||''}">${r.code?'取消':''}收藏</a>` + (p&&`</${p}>`));
            },!0),b.on('click','.lcp-add-fav',function(){
                var a = $(this);
                r(function(r){
                    if (r.code == 1) {
                        a.text('取消收藏').addClass('collected');
                    }else if (r.code == 2) {
                        a.text('收藏').removeClass('collected');
                    }else{
                        layer.msg(r.msg,{icon:0});
                    }
                },!1);
            });
        }
    }(lcp.config.favBtn);
    
    // 公告
    !function(d){
        var a = '网站公告',
            s = d.content,
            c = function(){
                localStorage.setItem('notice', s.length);
            };
            
        if (s && s.length != localStorage.getItem('notice')) setTimeout(function() {
            switch (d.type) {
                case '2':
                    var l = layer.alert(s, {
                        title: a,
                        skin: 'layui-layer-molv',
                        closeBtn: 0
                    }, function(){
                        c(),layer.close(l);
                    });
                    break;
                case '3':
                    layer.open({
                        type: 1,
                        title: 0,
                        skin: 'lcp-layui-layer-rb-notice',
                        shade: 0,
                        area: ['340px', '220px'],
                        offset: 'rb',
                        anim: 2,
                        content: s,
                        end: c
                    });
                    break;
                default:
                    layer.open({
                        type: 1,
                        title: a,
                        closeBtn: 0,
                        area: '300px;',
                        skin: 'lcp-layui-layer-rb-notice',
                        shade: 0.2,
                        btn: ['已读'],
                        btnAlign: 'c',
                        content: "<div style=padding:10px>"+s+"</div>",
                        end: c
                    });
            }
        }, 3e3); 
    }(lcp.config.notice);
    
    //购买请求
    lcp.buy = function (id,fn){
        widget.ajax({
            url: lcp.ajaxurl + 'purchase',
            data:{
                id
            },
            loadMessage: '正在购买...',
            success: function(r){
                switch (r.code) {
                    case 1:
                        fn(r);
                        zbp.plugin.emit("lcp.buy.success", r);
                        break;
                    case 2:
                        layer.confirm(r.msg, {
                            btn: ['前往充值','取消']
                        }, function(){
                            window.open(lcp.url.memberCentre+'#/User/Invest/to=Price');
                        });
                        break;
                    case 13:
                        guestBuyBox(id, r.data);
                        break;
                    case 12:
                        var l = layer.alert('请登录账户',{},function(){
                            layer.close(l),
                            layer.msg('正在进入登录页...', {icon: 16,time:false,shade:0.1});
                            location.href = lcp.url.login;
                        });
                        break;
                    default:
                        layer.alert(r.msg,{icon:r.code});
                }
            }
        });
    };
    
    lcp.open = function(url, b, fn){
        var isUrl = /^(https?:\/\/|\/\/[\w\d])/i.test(url),
            op = function(s){
                var a = window.open();
                return a === null ? null : a.document.write(s);
            };
        
        if (isUrl ? window.open(url) === null : op(url) === null){
            var a = layer.alert(`请点击下面蓝色按钮继续操作`,{btn:[b,'取消'],title:0,closeBtn:0,},function(){
                layer.close(a),(fn && fn());
                return isUrl ? window.open(url) : op(url);
            });
        }else{
            fn && fn();
        }
    };
    
    lcp.questionPaySuccess = function(fn){
        setTimeout(function() {
            var a = layer.confirm('您已支付成功了吗？', {
                btn: ['已支付','未支付'],
                icon:3
            }, function(){
                layer.close(a);
                fn();
            });
        }, 1000);
    };
    
    lcp.copy = function(s){
        var a = 'copy-content-input';
        b.append(`<input type="text" id="${a}" value="${s}">`);
        $('#'+a).select(); 
        document.execCommand("copy");
        $('#'+a).remove();
    };
    
    lcp.tradeCheck = function(n, t, ok, noy){
        widget.ajax({
            url: lcp.ajaxurl + 'checktarde',
            data:{
                no: n
            },
            loadMessage: t || false,
            success: function(r){
                if (r.code == 1){
                    r.msg == 'ok' ? (ok && ok(r)) : (noy && noy(r));
                }else{
                    layer.msg(r.msg, function(){});
                }
            }
        });
    };
    
    lcp.loadBody = function(u){
        var a = layer.msg('正在加载页面...',{icon:16,time:false,shade:.2});
        $.get(u,function(r){
            var m;
            if (m = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(r)) {
                $('body').html(m[1])
            }else{
                location.href = u;
            }
            layer.close(a);
        });
    }
    
    lcp.upload = function(o){
        var b = $('body'),
            url = o.url || lcp.ajaxurl+'upload',
            accept = o.accept || '',
            core = function(){
                var id=widget.randString(),d = $(this);;
                b.append(`<input type="file" id="${id}" accept="${accept}" style="display:none">`);
                var el=$('#'+id);
                b.one('change','#'+id,function(){
                    var f = new FormData();
                    f.append('file',$(this)[0].files[0]);
                    $.ajax({
                        url,
                        type: 'POST',
                        dataType: 'json',
                        data: f,
                        contentType: false,
                        processData: false,
                        xhr: function() {
                            var xhr = new XMLHttpRequest(),t;
                            xhr.upload.addEventListener('progress', function (e) {
                                if (e.lengthComputable) {
                                    t = Math.floor(e.loaded / e.total * 100);
                                    o.progress && o.progress(d, t);
                                }
                            });
                            return xhr;
                        },
                        success:function(r){
                            r.code == 1 && o.done(d, r);
                            (!o.success || o.success(d, r) === false) && r.code == 0 && layer.msg(r.msg,{icon:0});;
                        },
                        error:function(r){
                            (!o.error || o.error(d,r) === false) && layer.msg('上传失败',function(){});
                        }
                    });
                }),
                el.click();
            };
        typeof o.click === "object" ? o.click.click(core) : b.on('click',o.click,core);
    }
    
    lcp.AlipayQRCodeTips = function(a,b,r){
        var s = 'open-alipay-text';
        r.data.payment.name.indexOf('支付宝') !== -1 && /mobile/i.test(navigator.userAgent) ? (a.find('img').click(function(){
            location.href = 'alipays://platformapi/startapp?appId=20000067&url='+b;
        }),a.append(`<div class=${s}>点击二维码打开支付宝</div>`)) : a.children('.'+s).remove();
    }
    
    // 点击事件
    b.
    on('click','.lcpbuy', events.buy).
    on('click','.lcpdownload', events.download).
    on('click','.openin_hide_iframe', events.openin_hide_iframe).
    on('click','.lcp-hide-code',function(){
        var a = $(this).text();
        !/^\*+$/.test(a) ? (lcp.copy(a),layer.msg('已复制',{icon:1})) : layer.msg('无权查看该隐藏内容');
    }).
    on('focus','[focusTips]',function(){
        focusTips = layer.tips($(this).attr('focusTips'), this, {time:false,tips: [1, $(this).attr('focusTipsColor') || '#009688']});
    }).on('blur','[focusTips]',function(){
        window.focusTips && layer.close(focusTips);
    }).on('click','[autocopy]',function(){
        $(this).select();
        document.execCommand("Copy");
        layer.msg('已复制到剪切板',{icon:1});
    }).on('click','[lcp-event]',function(){
        var e = $(this).attr('lcp-event');
        events[e] && events[e].call(this);
    });
    
    // 初始化时添加磨砂效果用的class
    zbp.plugin.on("lcp.init.theme","lcp",function(e){
        if (e && e.color.index === 0){
            e.blur !== undefined || (e.blur = "1");
            switch (e.blur) {
                case "1":
                    $("body").addClass("blur-side");
                    break;
                case "2":
                    $("body").addClass("blur-side blur-all");
                    break;
            };
        }
    });
    
    console.log("\n%c LayCenter用户中心 %c \nhttps://kfuu.cn/plugin/7.html \n", `color: #fff;padding:15px 0 15px 40px;background:url(${bloghost}zb_users/plugin/LayCenter/logo.png) #606975 no-repeat 5px 5px;background-size:40px;font-size:18px;border-radius:2px`, "padding:5px 0;")
});