/* Table控件 */
function HTable(obj, config) {
    /*****************|参数初始化|*********************/
    htable = {};
    htable.Parent = $(obj);
    htable.config = config;
    htable.columns = config.columns;
    htable.COLUMN_NUM = htable.config.columns.length;
    htable.width = 0;
    htable.tbody_height = config.body_height;
    htable.ScrollWidth = 0;

    htable.cele = function (ele) {
        return $("<" + ele + "></" + ele + ">");
    }

    htable.cthead = function () {
        var i, tr = htable.cele("tr");
        for (i = 0; i < htable.COLUMN_NUM; i++) {
            var row = htable.config.columns[i];
            var th = htable.cele("th").text(row['name']);
            th.addClass(row['field']);
            tr.append(th);
            /*设置表头每列的宽度*/
            th.css({
                "width": row['width'] + 'px'
            });
        }
        htable.thead = htable.cele("thead").append(tr);
    }

    htable.get_scroll_width = function () {
        var noScroll, scroll, oDiv = document.createElement("DIV");
        oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
        noScroll = document.body.appendChild(oDiv).clientWidth;
        oDiv.style.overflowY = "scroll";
        scroll = oDiv.clientWidth;
        document.body.removeChild(oDiv);
        return noScroll - scroll;
    }

    htable.tbody_td_reflex = function (str) {
        return str;
    }

    htable.ctbody = function () {
        var i, j, tbody = htable.cele("tbody");
        for (i = 0; i < htable.config.data.length; i++) {
            var row = htable.config.data[i];
            var tr = htable.cele("tr").attr('row-id', (i + 1));
            for (j = 0; j < htable.COLUMN_NUM; j++) {
                var column = htable.columns[j];
                var td = htable.cele("td").html(column.td_reflex(row[j]));
                td.addClass(column.field);
                tr.append(td);
                td.css('text-align', column.align);
                td.css("width", column.width + "px");
            }
            tbody.append(tr);
        }
        htable.tbody = tbody;
    }

    htable.init = function () {
        var i, j;
        htable.width = 0;
        for (i = 0; i < htable.COLUMN_NUM; i++) {
            if (htable.columns[i].td_reflex == undefined) htable.columns[i].td_reflex = htable.tbody_td_reflex;
            htable.width = htable.width + 1 + htable.columns[i].width;
        }
        htable.width = htable.width + 1;
    }

    htable.css_from_style_strings = function (o, str) {
        var arr = str.split(";");
        var i, j, arr1;
        for (i = 0; i < arr.length; i++) {
            arr1 = arr[i].split(":");
            o.css(arr1[0], arr1[1]);
        }
    }

    htable.css_thead_style = function () {
        if (htable.ScrollWidth == 0) htable.ScrollWidth = htable.get_scroll_width();
        htable.thead.find("th").css({"border-bottom": "1px solid #D1D1D1", "border-right": "1px solid #D1D1D1"});
        htable.thead.css({"background-color": '#E7EFFA',"display": "table","width": "calc(100% - " + htable.ScrollWidth + "px)","font-size": "13px",});
        htable.thead.find("tr").css({"display": "table",'table-layout': 'fixed'});
    }

    htable.css_tbody_style = function () {
        htable.tbody.find("td").css({"word-wrap": 'break-word',"word-break": "break-all", "border-bottom": "1px solid #D1D1D1","border-right": "1px solid #D1D1D1", "white-space": "pre-line",});
        htable.tbody.css({"display": "block","overflow-y": "scroll","max-height": htable.tbody_height + "px","font-size": "13px",});
        htable.tbody.find('tr').css({"display": "table",'table-layout': 'fixed'});
    }

    htable.css_table_style = function () {
        htable.table.attr({"border": '0',"cellspacing": '0',"cellpadding": "0"});
        htable.table.css({"table-layout": 'fixed',"border-left": "1px solid #D1D1D1","border-top": "1px solid #D1D1D1","border-bottom": "1px solid #D1D1D1","color": "#403E2F","cursor": "default","width": (htable.width + htable.ScrollWidth) + "px"});
        htable.css_thead_style();
        htable.css_tbody_style();
    }

    htable.get_selected_row = function () {
        var ret = [];
        var sel = htable.tbody.find(".selected");
        if (sel.length < 1) return null;
        var row_num = parseInt(sel.attr("row-id")) - 1;
        return htable.config.data[row_num];
    }

    htable.add_event = function () {
        htable.tbody.find("tr").click(function (event) {
            if ($(this).hasClass('selected')) return;
            /*移除已经select行*/
            var sel = $(this).parent().find(".selected");
            if (sel.length > 0) {
                sel.css({"background-color": ''});
                sel.removeClass('selected');
            }

            $(this).addClass('selected');
            $(this).css({"background-color": '#90F3E4'});
            /*移除已经select行*/
            $(this).parent().find(".selected")
        });
    }

    htable.refresh = function () {
        htable.Parent.html("");
        htable.init();
        htable.cthead();
        htable.ctbody();
        htable.table = htable.cele("table");
        htable.table.append(htable.thead);
        htable.table.append(htable.tbody);
        htable.Parent.html(htable.table);

        htable.css_table_style();
        htable.add_event();
    }
    /*****************|执行入口|*********************/
    //htable.refresh();
    return htable;
}


/** Dialog控件 */
function HDialog() {
    hhis = {};
    /**********************************************************/
    hhis.dialog_width = 400;
    hhis.dialog_height = 400;
    hhis.dialog_title = "周报编辑";
    hhis.sdialog_id = "";
    hhis.cancle_handler = null;
    hhis.confirn_handler = null;

    /**********************************************************/

    hhis.CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    hhis.UUID = function (len, radix) {
        var chars = hhis.CHARS,
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
    hhis.cele = function (ele) {
        return $("<" + ele + "></" + ele + ">");
    }
    hhis.css_from_style_strings = function (o, str) {
        var arr = str.split(";");
        var i, j, arr1;
        for (i = 0; i < arr.length; i++) {
            arr1 = arr[i].split(":");
            if (arr1.length > 1) o.css($.trim(arr1[0]), arr1[1]);
        }
    }

    hhis.dialog_event = function () {
        var did = hhis.sdialog_id;
        hhis.odialog_head.find(".exit").click(function (event) {
            $("#" + did).remove();
            hhis.clear();
        });
        hhis.odialog_foot.find(".exit").click(function (event) {
            if (hhis.cancle_handler != null)
                hhis.cancle_handler();
            $("#" + did).remove();
            hhis.clear();
        });
        hhis.odialog_foot.find(".confirn").click(function (event) {
            if (hhis.confirn_handler != null)
                hhis.confirn_handler();
            $("#" + did).remove();
            hhis.clear();
        });
    }

    hhis.set_dialog_title = function (title) {
        hhis.dialog_title = title;
        if (hhis.odialog_head != undefined) {
            hhis.odialog_head.find(".title").text(hhis.dialog_title);
        }
    }
    hhis.set_info_msg = function (title, msg) {
        hhis.set_dialog_title(title);
        hhis.odialog_body.text(msg);
        str = "color: #323026;";
        hhis.css_from_style_strings(hhis.odialog_body, str);
    }

    hhis.clear = function () {
        // hhis.odialog = null;
        // hhis.odialog_body = null;
        // hhis.odialog_body_table_body = null;
        // hhis.odialog_body_table_body_row = null;
    }

    /**TABLE */
    hhis.add_row = function () {
        var cstr = "";
        if (hhis.odialog_body_table_body == undefined || hhis.odialog_body_table_body == null) {
            hhis.odialog_body.html("");
            hhis.odialog_body.append(hhis.cele("table").append(hhis.cele("tbody")));
            hhis.odialog_body_table_body = hhis.odialog_body.find("tbody");
            cstr = "width: 100%; border-collapse: separate; border-spacing: 0px 20px;";
            hhis.css_from_style_strings(hhis.odialog_body.find("table"), cstr);
        }
        hhis.odialog_body_table_body_row = hhis.cele("tr");
        hhis.odialog_body_table_body.append(hhis.odialog_body_table_body_row);
        cstr = "margin: 10px;";
        hhis.css_from_style_strings(hhis.odialog_body_table_body_row, cstr);
    }

    hhis.set_value_by_class = function(scls, value) {
        hhis.odialog_body.find("."+scls).val(value);
    }

    hhis.get_value_by_class = function(scls) {
        return hhis.odialog_body.find("."+scls).val();
    }

    hhis.add_input_long = function (labs, cls) {
        hhis.add_input(labs, cls, 300, 3);
    };

    hhis.add_lable = function(labs) {
        var l = hhis.cele("lable").text(labs);
        var td = hhis.cele("td").append(l).css({"text-align": "right", "font-size":"13px", "font-weight": "bold", "color": "#2C2B35","padding-right": "3px"});
        return td;
    }

    hhis.add_input = function (labs /*标签*/ , cls /*类名*/ , len = 150, colspan = 0 /*跨行数*/ ) {
        hhis.odialog_body_table_body_row.append(hhis.add_lable(labs));

        var input = hhis.cele("input").attr("type", "text").addClass(cls).width(len);
        td = hhis.cele("td").append(input);
        td.attr("colspan", colspan + "");
        hhis.odialog_body_table_body_row.append(td);

        /**CSS */
        var cstr = "outline: none; background: none; border: 1px solid #D9D9D9; height:32px; border-radius: 4px; padding-top: 0;padding-bottom: 0;padding-left: 3px;";
        hhis.css_from_style_strings(input, cstr);
        input.blur(function () {
            var cstr = "outline: none; background: none; border: 1px solid #D9D9D9;box-shadow: none;";
            hhis.css_from_style_strings($(this), cstr);
        });
        input.focus(function () {
            var cstr = "border: 1px solid #4BB2FD;box-shadow: 0 0 3px #4BB2FD;background-color: #FFFCD5;transition: all 0.3s;";
            hhis.css_from_style_strings($(this), cstr);
        });
    }

    hhis.get_now_date = function() {
        var date = new Date();
        var ret = "";
        var mon = date.getMonth()+1;
        if (mon < 10) {
            mon = "0"+mon;
        }else {
            mon = mon + "";
        }
        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        } else {
            day = day + "";
        }
        ret = date.getFullYear()+"-" + mon + "-" + day;
        return ret;
    }

    hhis.add_date_input = function(labs /*标签*/ , cls /*类名*/ , len = 150, colspan = 0 /*跨行数*/) {
        hhis.odialog_body_table_body_row.append(hhis.add_lable(labs));

        var dinput = hhis.cele("input").attr("type", "text").addClass(cls).width(len);
        td = hhis.cele("td").append(dinput);
        td.attr("colspan", colspan + "");
        hhis.odialog_body_table_body_row.append(td);
        dinput.datepicker({
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true,
            showWeek: true,
            firstDay: 1,
            dateFormat: "yy-mm-dd"
        });

        /**初始化 */
        dinput.val(hhis.get_now_date());
        /**CSS */
        var cstr = "outline: none; background: none; border: 1px solid #D9D9D9; height:32px; border-radius: 4px; padding-top: 0;padding-bottom: 0;padding-left: 3px;";
        hhis.css_from_style_strings(dinput, cstr);
        dinput.blur(function () {
            var cstr = "outline: none; background: none; border: 1px solid #D9D9D9;box-shadow: none;";
            hhis.css_from_style_strings($(this), cstr);
        });
        dinput.focus(function () {
            var cstr = "border: 1px solid #4BB2FD;box-shadow: 0 0 3px #4BB2FD;background-color: #FFFCD5;transition: all 0.3s;";
            hhis.css_from_style_strings($(this), cstr);
        });
    }

    hhis.add_textarea = function (labs /*标签*/ , cls /*类名*/ , wide = 300 /*宽*/ , high = 80 /*高*/ ) {
        hhis.odialog_body_table_body_row.append(hhis.add_lable(labs));

        var textarea = hhis.cele("textarea").addClass(cls).height(high).width(wide);
        td = hhis.cele("td").attr("colspan", "3").append(textarea);
        hhis.odialog_body_table_body_row.append(td);

        /**CSS */
        var cstr = "outline: none; background: none; border: 1px solid #D9D9D9; border-radius: 4px; font-size: 13px; padding: 1px 0 1px 3px;";
        hhis.css_from_style_strings(textarea, cstr);
        textarea.blur(function () {
            var cstr = "outline: none; background: none; border: 1px solid #D9D9D9;box-shadow: none;";
            hhis.css_from_style_strings($(this), cstr);
        });
        textarea.focus(function () {
            var cstr = "border: 1px solid #4BB2FD;box-shadow: 0 0 3px #4BB2FD;background-color: #FFFCD5;transition: all 0.3s;";
            hhis.css_from_style_strings($(this), cstr);
        });
    }

    hhis.add_select = function (labs /*标签*/ , cls /*类名*/ , sels /*选择项*/ ) {
        hhis.odialog_body_table_body_row.append(hhis.add_lable(labs));

        var select = hhis.cele("select").addClass(cls);
        for (var i = 0; i < sels.length; i++) {
            select.append(hhis.cele("option").text(sels[i]));
        }
        td = hhis.cele("td").append(select);
        hhis.odialog_body_table_body_row.append(td);

        /**CSS */
        var cstr = "outline: none; background: none; border: 1px solid #D9D9D9; width:155px; height:32px; border-radius: 4px; padding-top: 0;padding-bottom: 0;padding-left: 3px;";
        hhis.css_from_style_strings(select, cstr);
        select.blur(function () {
            var cstr = "outline: none; background: none; border: 1px solid #D9D9D9;box-shadow: none;";
            hhis.css_from_style_strings($(this), cstr);
        });
        select.focus(function () {
            var cstr = "border: 1px solid #4BB2FD;box-shadow: 0 0 3px #4BB2FD;background-color: #FFFCD5;transition: all 0.3s;";
            hhis.css_from_style_strings($(this), cstr);
        });
    }

    hhis.cbokeh = function () {
        hhis.sbokeh_id = hhis.UUID(15, 100);
        hhis.obokeh = hhis.cele("div").addClass(hhis.sbokeh_id);
        $("body").append(hhis.obokeh);

        var cstr = "position: fixed; width: 100%; height: 100%; background-color: black; opacity: 50%; transition: all 0.2s; z-index: 66;";
        hhis.css_from_style_strings(hhis.obokeh, cstr);
    }

    hhis.css_dialog = function () {
        /**Dialog */
        var str = "border: 1px solid #C5C5C5; width: " + hhis.dialog_width + "px; padding: 2px; z-index: 101;background-color: white;";
        str += "top: 20%; left: 0; right: 0; margin: 0 auto; position: fixed; border-radius: 4px;";
        hhis.css_from_style_strings(hhis.odialog, str);

        /**Head */
        str = "background-color: #D5D4D4; height: 30px; border-top-left-radius: 4px; border-top-right-radius: 4px; display: table-cell; vertical-align: middle; width:" +
            (hhis.dialog_width - 5) + "px; font-weight: bold;";
        str += "padding-left:5px; padding-right:5px; ";
        hhis.css_from_style_strings(hhis.odialog_head, str);
        str = "float: left;";
        hhis.css_from_style_strings(hhis.odialog_head.find(".title"), str);
        str = "float: right; width: 30px; border-radius: 3px; ";
        hhis.css_from_style_strings(hhis.odialog_head.find("button"), str);

        /**Body */
        str = "";
        hhis.css_from_style_strings(hhis.odialog_body, str);

        /**Foot */
        str = "float: right; margin-right:15px; margin-top:0px; margin-bottom: 15px; width: 60px; border-radius: 3px; font-weight: bold; color: #454257;";
        hhis.css_from_style_strings(hhis.odialog_foot.find("button"), str);
    }

    hhis.set_dialog_vertical_center = function () {
        var wh = $(window).height();
        var dh = hhis.odialog.outerHeight();
        var bl = ((wh / 2 - dh / 2) / (wh)) * 100;
        var str = "top: " + bl + "%;";
        hhis.css_from_style_strings(hhis.odialog, str);
    }

    hhis.cdialog = function () {
        hhis.sdialog_id = hhis.UUID(10, 100);
        hhis.odialog = hhis.cele("div").attr("id", hhis.sdialog_id);
        hhis.odialog_head = hhis.cele("div").addClass("head");
        hhis.odialog_head.append(hhis.cele("span").addClass("title").text(hhis.dialog_title));
        hhis.odialog_head.append(hhis.cele("button").addClass("exit").text("X"));

        hhis.odialog_body = hhis.cele("div").addClass("body");

        hhis.odialog_foot = hhis.cele("div").addClass("foot");
        hhis.odialog_foot.append(hhis.cele("button").addClass("exit").text("Cancle"));
        hhis.odialog_foot.append(hhis.cele("button").addClass("confirn").text("OK"));

        hhis.odialog.append(hhis.odialog_head);
        hhis.odialog.append(hhis.odialog_body);
        hhis.odialog.append(hhis.odialog_foot);

        hhis.dialog_event();
        hhis.css_dialog();
    }

    hhis.show = function () {
        //hhis.cbokeh();
        hhis.cdialog();
        $("body").append(hhis.odialog);
        hhis.set_dialog_vertical_center();
    }

    return hhis;
}


/**Table 分页栏控件 */
function HTableStatusBar(obj) {
    var his = {};
    his.obj  = obj;
    his.page_size = 0;
    his.total_page_num = 0;
    his.now_page_num = 0;


    his.cbutton = function(cls, text, width = 50) {
        var btn = hComn.cele("button").addClass(cls).text(text).width(width);
        /**CSS */
        var cstr = "outline: none; background: none; padding: 0; border: 1px solid #E2E2E2; font-size: 12px; line-height: 24px; color: #333333; margin: 0 1px;";
        hComn.css_from_style_strings(btn, cstr);

        btn.hover(function(){
            cstr = "color: #099B98; ";
            hComn.css_from_style_strings(btn, cstr);
        }, function(){
            cstr = "color: #333333;";
            hComn.css_from_style_strings(btn, cstr);
        });

        btn.click(function(){
            console.info($(this).text());
        });
        return btn;
    }

    his.cspan = function(cls, text) {
        var sp = hComn.cele("span").addClass(cls).text(text);

        /**CSS */
        var cstr = "font-size: 13px;";
        hComn.css_from_style_strings(sp, cstr);

        return sp;
    }

    his.cspace = function(width=4) {
        var sp = hComn.cele("span");
        /**CSS */
        var cstr = "margin: 0 " + width + "px; ";
        hComn.css_from_style_strings(sp, cstr);

        return sp;
    }

    his.cselect_page_num = function (cls) {  
        var sel = hComn.cele("select").addClass(cls);
        var opt = hComn.cele("option").attr("value", "10").text(" 10 条/页 ");
        sel.append(opt);
        opt = hComn.cele("option").attr("value", "20").text(" 20 条/页 ");
        opt.attr("selected", true); his.page_size = 20;
        sel.append(opt);
        opt = hComn.cele("option").attr("value", "50").text(" 50 条/页 ");
        sel.append(opt);
        opt = hComn.cele("option").attr("value", "100").text(" 100 条/页 ");
        sel.append(opt);

        /**CSS */
        var cstr = "outline: none; border: 1px solid #E2E2E2; font-size: 12px; line-height: 24px; height: 24px;";
        hComn.css_from_style_strings(sel, cstr);

        sel.change(function(){
            console.info($(this).find("option:selected").text());
            //his.page_size = parseInt($(this).find("option:selected").val());
        });

        return sel;
    }

    his.cinput = function(cls, width=30) {
        var input = hComn.cele("input").addClass(cls).width(width);
        /**CSS */
        var cstr = "outline: none; border: 1px solid #E2E2E2; font-size: 12px; line-height: 22px; margin: 0 4px; padding: 0 4px;";
        hComn.css_from_style_strings(input, cstr);

        return input;
    }

    his.set_select_page_size_change = function(handle) {
        his.obj.find(".page_size_sel").change(function(){
            his.page_size = parseInt($(this).find("option:selected").val());
            his.now_page_num = 1;
            handle();
            his.set_page_info(his.total_page_num, his.now_page_num);
        });
    }
    his.set_page_info = function(total_pages = null, now_page = null) {
        if (!(total_pages == null || now_page == null)) {
            his.total_page_num = total_pages;
            his.now_page_num = now_page;
        }
        his.obj.find(".page_info").text(his.now_page_num + "/" + his.total_page_num);
    }
    his.get_page_size = function() {
        return his.page_size;
    }
    his.set_first_page_click_handle = function(handle) {
        his.obj.find(".first").click(function() {
            his.now_page_num = 1;
            handle();
            his.set_page_info(his.total_page_num, his.now_page_num);
        });
    }
    his.set_last_page_click_handle = function(handle) {
        his.obj.find(".last").click(function() {
            his.now_page_num = his.total_page_num;
            handle();
            his.set_page_info(his.total_page_num, his.now_page_num);
        });
    }
    his.set_next_page_click_handle = function (handle) {  
        his.obj.find(".next").click(function() {
            his.now_page_num = his.now_page_num + 1;
            his.now_page_num = his.now_page_num > his.total_page_num ? his.total_page_num : his.now_page_num;
            handle();
            his.set_page_info(his.total_page_num, his.now_page_num);
        });
    }
    his.set_prev_page_click_handle = function (handle) {
        his.obj.find(".prev").click(function() {
            his.now_page_num = his.now_page_num - 1;
            his.now_page_num = his.now_page_num < 1 ? 1 : his.now_page_num;
            handle();
            his.set_page_info(his.total_page_num, his.now_page_num);
        });
    }
    his.set_goto_page_click_handle = function(handle) {
        his.obj.find(".turn").click(function() {
            var pn = parseInt( his.obj.find(".goto_page").val() );
            if ( !isNaN(pn)) {
                his.now_page_num = pn;
                his.now_page_num = his.now_page_num > his.total_page_num ? his.total_page_num : his.now_page_num;
                his.now_page_num = his.now_page_num < 1 ? 1 : his.now_page_num;
                handle();
                his.set_page_info(his.total_page_num, his.now_page_num);
            }
            his.obj.find(".goto_page").val("");
        });
    }
    his.set_total_data_num_info = function (num) {  
        his.obj.find(".total_data").text(num + "");
    }
    his.is_first_page = function() {
        return his.now_page_num == 1;
    }
    his.is_last_page = function() {
        return his.now_page_num == his.total_page_num;
    }

    his.chtml = function () {
        var fbody = hComn.cele("div");
        var cstr = "border: 1px solid white; ";
        hComn.css_from_style_strings(fbody, cstr);
        
        fbody.append(his.cspan("", " 当前 "));
        fbody.append(his.cspan("page_info", " 1/5 "));
        fbody.append(his.cspan("", " 页 "));

        fbody.append(his.cspace(10));
        fbody.append(his.cselect_page_num("page_size_sel"));
        fbody.append(his.cspace(10));

        fbody.append(his.cbutton("first", "首页", 40));
        fbody.append(his.cbutton("prev", "上一页"));
        fbody.append(his.cbutton("next", "下一页"));
        fbody.append(his.cbutton("last", "尾页", 40));

        fbody.append(his.cspace(10));
        fbody.append(his.cspan("", "到第"));
        fbody.append(his.cinput("goto_page", 20));
        fbody.append(his.cspan("", "页"));

        fbody.append(his.cspace(10));
        fbody.append(his.cbutton("turn", "跳转", 40));
        fbody.append(his.cspace(10));

        fbody.append(his.cspan("", "总共 "));
        fbody.append(his.cspan("total_data", "0"));
        fbody.append(his.cspan("", " 条"));

        his.obj.append(fbody);
    }
    his.init = function () {
        his.chtml();
    }
    
    his.init();
    return his;
}