function hComn() {
    this.version = "1.0.0";
}

/**创建一个元素 */
hComn.cele = function(ele) {return $("<" + ele + "></" + ele + ">");}

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

