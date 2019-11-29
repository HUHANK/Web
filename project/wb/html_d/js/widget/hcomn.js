function hComn() {
    this.version = "1.0.0";
}

/**创建一个元素 */
hComn.cele = function(ele) {return $("<" + ele + "></" + ele + ">");}
/**创建一个input的输入框，类型为text */
hComn.cinput = function (type = "text"/*类型*/, cls = ""/*类名*/, width = 150, require=false/*是否必填*/) {
    var input = hComn.cele("input").attr("type", type).addClass(cls).width(width);

    /**CSS */
    var cstr = "outline: none; background: none; border: 1px solid #D9D9D9; height:32px; border-radius: 4px; padding-top: 0;padding-bottom: 0;padding-left: 3px;";
    if (require == true)
        cstr = "outline: none; background: none; border: 1px solid #FF2E2E; height:32px; border-radius: 4px; padding-top: 0;padding-bottom: 0;padding-left: 3px;";
    hComn.css_from_style_strings(input, cstr);

    input.blur(function () {
        cstr = "outline: none; background: none; border: 1px solid #D9D9D9;box-shadow: none;";
        if (require == true) {
            var val = $.trim($(this).val());
            if (val.length < 1)
                cstr = "outline: none; background: none; border: 1px solid #FF2E2E;box-shadow: none;";
        }
        hComn.css_from_style_strings($(this), cstr);
    });
    input.focus(function () {
        var cstr = "border: 1px solid #159CFF;box-shadow: 0 0 3px #4BB2FD;background-color: #FFFCD5;transition: all 0.3s;";
        hComn.css_from_style_strings($(this), cstr);
    });
    return input;
}
hComn.cselect = function () {
    var select = hComn.cele("select");
}

/**获取滚动条的宽度 */
hComn.get_scroll_width = function() {
    var noScroll, scroll, oDiv = document.createElement("DIV");
    oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll - scroll;
}

/**把css样式字符串转换并设置成元素的样式 */
hComn.css_from_style_strings = function(o, str) {
    var arr = str.split(";");
    var i, j, arr1;
    for (i = 0; i < arr.length; i++) {
        arr1 = arr[i].split(":");
        if (arr1.length > 1) o.css($.trim(arr1[0]), arr1[1]);
    }
}

Date.prototype.DateAdd = function(strInterval, Number) {   
    var dtTmp = this;
    switch (strInterval) {
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}

Date.prototype.GetWeekStartAndEndDate = function() {
    var date = new Date(this);
    var wd = date.getDay() - 1;
    var start_date = date.DateAdd("d", (-1)*wd);
    var end_date = start_date.DateAdd("d", 6);
    var ret = [];
    ret.push(start_date.toJSON().substring(0, 10));
    ret.push(end_date.toJSON().substring(0, 10));
    return ret;
}

/**产生UUID字符串 */
hComn.UUID = function(len = 10, radix = 100) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
        uuid = [],
        i;
    radix = radix || chars.length;
    if (len)
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
}