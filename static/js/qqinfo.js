$(function() {
  $.fn.flash = function(a) {
    $(this).animate(
      {
        opacity: "toggle"
      },
      500,
      function() {
        "none" == $(this).css("display") && $(this).flash(0);
      }
    ),
      a > 1 && $(this).flash(a - 1);
  };

  $("#inpName,#inpQQ").blur(function() {
    let inpVal = $(this).val();
    if (isNaN(inpVal)) {
      return;
    }
    // fnJSONP(inpVal, fnFill);
    fnAjax(inpVal, fnFill);
  });
  function fnAjax(qq, fun) {
    let objRlt;
    $.getJSON(ajaxurl + "qqinfo&qq=" + qq, function(data) {
      if (data && !data.err.code) {
        objRlt = data.data;
        console.log(objRlt);
        fun(objRlt.info, qq);
      }
    });
  }
  // window.portraitCallBack = function(info) {
  //   console.log(info);
  // }
  function fnJSONP(qq, fun) {
    $.ajax({
      url: "https://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=" + qq,
      type: "GET",
      contentType:"application/x-javascript; charset:GBK",
      dataType: "jsonp", //指定服务器返回的数据类型
      jsonpCallback: "portraitCallBack", //指定回调函数名称
      success: function(data) {
        console.log(data,qq);
        fun(data[qq], qq);
        console.info("调用success");
      }
    });
  }

  function fnFill(info, qq) {
    // $("img.avatar").attr("src",info[0]);
    // $("input.avatar").val(info[0]);
    $("#inpName").val(info[6]);
    $("#inpEmail").val(qq + "@qq.com");
    //$("#inpHomePage").val("https://user.qzone.qq.com/" + qq + "/infocenter");
  }
});
