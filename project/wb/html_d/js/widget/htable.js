/* Table控件 */
function HTable(obj, config) {
    /*****************|参数初始化|*********************/
    hhis = {};
    hhis.Parent = $(obj);
    hhis.config = config;
    hhis.columns = config.columns;
    hhis.COLUMN_NUM = hhis.config.columns.length;
    hhis.width = 0;
    hhis.tbody_height = config.body_height;

    hhis.cele = function (ele) {
        return $("<" + ele + "></" + ele + ">");
    }

    hhis.cthead = function () {
        var i, tr = hhis.cele("tr");
        for (i = 0; i < hhis.COLUMN_NUM; i++) {
            var row = hhis.config.columns[i];
            var th = hhis.cele("th").text(row['name']);
            th.addClass(row['field']);
            tr.append(th);
            /*设置表头每列的宽度*/
            th.css({
                "width": row['width'] + 'px'
            });
        }
        hhis.thead = hhis.cele("thead").append(tr);
    }

    hhis.get_scroll_width = function () {
        var noScroll, scroll, oDiv = document.createElement("DIV");
        oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
        noScroll = document.body.appendChild(oDiv).clientWidth;
        oDiv.style.overflowY = "scroll";
        scroll = oDiv.clientWidth;
        document.body.removeChild(oDiv);
        return noScroll - scroll;
    }

    hhis.tbody_td_reflex = function (str) {
        return str;
    }

    hhis.ctbody = function () {
        var i, j, tbody = hhis.cele("tbody");
        for (i = 0; i < hhis.config.data.length; i++) {
            var row = hhis.config.data[i];
            var tr = hhis.cele("tr").attr('row-id', (i + 1));
            for (j = 0; j < hhis.COLUMN_NUM; j++) {
                var column = hhis.columns[j];
                var td = hhis.cele("td").html(column.td_reflex(row[j]));
                td.addClass(column.field);
                tr.append(td);
                td.css('text-align', column.align);
                td.css("width", column.width + "px");
            }
            tbody.append(tr);
        }
        hhis.tbody = tbody;
    }

    hhis.init = function () {
        var i, j;
        for (i = 0; i < hhis.COLUMN_NUM; i++) {
            if (hhis.columns[i].td_reflex == undefined) hhis.columns[i].td_reflex = hhis.tbody_td_reflex;
            hhis.width = hhis.width + 1 + hhis.columns[i].width;
        }
        hhis.width = hhis.width + 1;
    }

    hhis.css_from_style_strings = function (o, str) {
        var arr = str.split(";");
        var i, j, arr1;
        for (i = 0; i < arr.length; i++) {
            arr1 = arr[i].split(":");
            o.css(arr1[0], arr1[1]);
        }
    }

    hhis.css_thead_style = function () {
        hhis.thead.find("th").css({
            "border-bottom": "1px solid #D1D1D1",
            "border-right": "1px solid #D1D1D1"
        });
        hhis.thead.css({
            "background-color": '#E7EFFA',
            "display": "table",
            "width": "calc(100% - " + hhis.get_scroll_width() + "px)",
            "font-size": "13px",
        });
    }

    hhis.css_tbody_style = function () {
        hhis.tbody.find("td").css({
            "word-wrap": 'break-word',
            "word-break": "break-all",
            "border-bottom": "1px solid #D1D1D1",
            "border-right": "1px solid #D1D1D1",
            "white-space": "pre-line",
        });
        hhis.tbody.css({
            "display": "block",
            "overflow-y": "scroll",
            "max-height": hhis.tbody_height + "px",
            "font-size": "13px",
        });
        hhis.tbody.find('tr').css({
            "display": "table",
            'table-layout': 'fixed'
        });
    }

    hhis.css_table_style = function () {
        hhis.table.attr({
            "border": '0',
            "cellspacing": '0',
            "cellpadding": "0"
        });
        hhis.table.css({
            "table-layout": 'fixed',
            "border-left": "1px solid #D1D1D1",
            "border-top": "1px solid #D1D1D1",
            "border-bottom": "1px solid #D1D1D1",
            "color": "#403E2F",
            "cursor": "default",
            "width": (hhis.width + hhis.get_scroll_width()) + "px"
        });
        hhis.css_thead_style();
        hhis.css_tbody_style();
    }

    hhis.get_selected_row = function () {
        var ret = [];
        var sel = hhis.tbody.find(".selected");
        if (sel.length < 1) return ret;
        var row_num = parseInt(sel.attr("row-id")) - 1;
        return hhis.config.data[row_num];
    }

    hhis.add_event = function () {
        hhis.tbody.find("tr").click(function (event) {
            if ($(this).hasClass('selected')) return;
            /*移除已经select行*/
            var sel = $(this).parent().find(".selected");
            if (sel.length > 0) {
                sel.css({
                    "background-color": ''
                });
                sel.removeClass('selected');
            }

            $(this).addClass('selected');
            $(this).css({
                "background-color": '#90F3E4'
            });
            /*移除已经select行*/
            $(this).parent().find(".selected")
        });
    }

    hhis.main = function () {
        hhis.init();
        hhis.cthead();
        hhis.ctbody();
        hhis.table = hhis.cele("table");
        hhis.table.append(hhis.thead);
        hhis.table.append(hhis.tbody);
        hhis.Parent.html(hhis.table);

        hhis.css_table_style();
        hhis.add_event();
    }
    /*****************|执行入口|*********************/
    hhis.main();
    return hhis;
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
        if (hhis.odialog_body_table_body == undefined || hhis.odialog_body_table_body == null) {
            hhis.odialog_body.html("");
            hhis.odialog_body.append(hhis.cele("table").append(hhis.cele("tbody")));
            hhis.odialog_body_table_body = hhis.odialog_body.find("tbody");
            var cstr = "width: 100%;";
            hhis.css_from_style_strings(hhis.odialog_body.find("table"), cstr);
        }
        hhis.odialog_body_table_body_row = hhis.cele("tr");
        hhis.odialog_body_table_body.append(hhis.odialog_body_table_body_row);
    }

    hhis.add_input = function (labs /*标签*/ , cls /*类名*/ ) {
        var td = hhis.cele("td").append(hhis.cele("label").text(labs));
        hhis.odialog_body_table_body_row.append(td);

        var input = hhis.cele("input").attr("type", "text").addClass(cls);
        td = hhis.cele("td").append(input);
        hhis.odialog_body_table_body_row.append(td);

        var cstr = "outline: none; background: none; border: 1px solid #D9D9D9; width:150px; height:32px; border-radius: 4px; padding-top: 0;padding-bottom: 0;padding-left: 3px;";
        hhis.css_from_style_strings(input, cstr);
        
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
        str = "float: right;";
        hhis.css_from_style_strings(hhis.odialog_head.find("button"), str);

        /**Body */
        str = "";
        hhis.css_from_style_strings(hhis.odialog_body, str);

        /**Foot */
        str = "float: right; margin-right:10px; margin-top:10px; margin-bottom: 5px;";
        hhis.css_from_style_strings(hhis.odialog_foot.find("button"), str);
    }

    hhis.set_dialog_vertical_center = function () {
        var wh = $(window).height();
        var dh = hhis.odialog.outerHeight();
        var bl = ((wh / 2 - dh / 2) / (wh)) * 100 - 10;
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
        hhis.cdialog();
        $("body").append(hhis.odialog);
        hhis.set_dialog_vertical_center();
    }

    return hhis;
}