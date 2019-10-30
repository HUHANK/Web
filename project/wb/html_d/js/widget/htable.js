
/* Table控件 */
function HTable(obj, config) {
    /*****************|参数初始化|*********************/
    this.Parent = $(obj);
    this.config = config;
    this.columns = config.columns;
    this.COLUMN_NUM = this.config.columns.length;
    this.width = 0;
    this.tbody_height = config.body_height;

    this.cele = function(ele) { return $("<"+ele+"></"+ele+">"); }

    this.cthead = function() {
        var i,tr = this.cele("tr");
        for(i=0; i<this.COLUMN_NUM; i++) {
            var row = this.config.columns[i];
            var th = this.cele("th").text(row['name']);
            th.addClass(row['field']);
            tr.append(th);
            /*设置表头每列的宽度*/
            th.css({ "width": row['width']+'px' });
        }
        this.thead = this.cele("thead").append(tr);
    }

    this.get_scroll_width = function () {
      var noScroll, scroll, oDiv = document.createElement("DIV");  
      oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";  
      noScroll = document.body.appendChild(oDiv).clientWidth;  
      oDiv.style.overflowY = "scroll";  
      scroll = oDiv.clientWidth;  
      document.body.removeChild(oDiv);
      return noScroll-scroll;  
    }  

    this.tbody_td_reflex = function (str) { return str; }

    this.ctbody = function() {
        var i, j, tbody = this.cele("tbody");
        for( i=0; i<this.config.data.length; i++) {
            var row = this.config.data[i];
            var tr = this.cele("tr").attr('row-id', (i+1));
            for(j=0; j<this.COLUMN_NUM; j++) {
                var column = this.columns[j];
                var td = this.cele("td").html(column.td_reflex(row[j]));
                td.addClass(column.field);
                tr.append(td);
                td.css('text-align', column.align);
                td.css("width", column.width+"px");
            }
            tbody.append(tr);
        }
        this.tbody = tbody;
    }

    this.init = function() {
        var i,j;
        for (i=0; i<this.COLUMN_NUM; i++) {
            if (this.columns[i].td_reflex == undefined) this.columns[i].td_reflex = this.tbody_td_reflex;
            this.width = this.width + 1 + this.columns[i].width;
        }
        this.width = this.width + 1;
    }

    this.css_from_style_strings = function(o, str) {
        var arr = str.split(";");
        var i,j, arr1;
        for(i=0; i<arr.length; i++) {
            arr1 = arr[i].split(":");
            o.css(arr1[0], arr1[1]);
        }
    }

    this.css_thead_style = function() {
        this.thead.find("th").css({ "border-bottom": "1px solid #D1D1D1", "border-right": "1px solid #D1D1D1" });
        this.thead.css({ "background-color": '#E7EFFA', "display": "table", "width": "calc(100% - " + this.get_scroll_width() + "px)", 
            "font-size": "13px",
        });
    }

    this.css_tbody_style = function() {
        this.tbody.find("td").css({
            "word-wrap": 'break-word', "word-break": "break-all", "border-bottom": "1px solid #D1D1D1", "border-right": "1px solid #D1D1D1", "white-space": "pre-line",
        });
        this.tbody.css({
            "display": "block", "overflow-y": "scroll", "max-height": this.tbody_height + "px", "font-size": "13px",
        });
        this.tbody.find('tr').css({
            "display": "table", 'table-layout': 'fixed'
        });
    }

    this.css_table_style = function() {
        this.table.attr({
            "border": '0', "cellspacing": '0', "cellpadding": "0"
        });
        this.table.css({
            "table-layout": 'fixed', "border-left": "1px solid #D1D1D1", "border-top": "1px solid #D1D1D1", "border-bottom": "1px solid #D1D1D1",
            "color": "#403E2F", "cursor": "default", "width": (this.width+this.get_scroll_width())+"px"
        });
        this.css_thead_style(); this.css_tbody_style();
    }

    this.get_selected_row = function() {
        var ret = [];
        var sel = this.tbody.find(".selected");
        if (sel.length < 1) return ret;
        var row_num = parseInt( sel.attr("row-id") )-1;
        return this.config.data[row_num];
    }

    this.add_event = function() {
        this.tbody.find("tr").click(function(event) {
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

    this.main = function() {
        this.init();
        this.cthead();
        this.ctbody();
        this.table = this.cele("table");
        this.table.append(this.thead);
        this.table.append(this.tbody);
        this.Parent.html(this.table);

        this.css_table_style();
        this.add_event();
    }
    /*****************|执行入口|*********************/
    this.main();
}


/** Dialog控件 */
function HDialog(config) {
    /**********************************************************/
    this.dialog_width = 400;
    this.dialog_height = 400;
    this.dialog_title = "周报编辑";
    this.sdialog_id = "";
    /**********************************************************/

    this.CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    this.UUID = function(len, radix) {
        var chars = this.CHARS, uuid = [], i;
        radix = radix || chars.length;
        if (len) for (i=0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i =0; i<36; i++) {
                r = 0|Math.random()*16;
                uuid[i] = chars[(i==19)?(r &0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    }
    this.cele = function(ele) { return $("<"+ele+"></"+ele+">"); }
    this.css_from_style_strings = function(o, str) {
        var arr = str.split(";");
        var i,j, arr1;
        for(i=0; i<arr.length; i++) {
            arr1 = arr[i].split(":");
            if (arr1.length > 1) o.css($.trim(arr1[0]), arr1[1]);
        }
    }

    this.dialog_event = function() {
        var did = this.sdialog_id;
        this.odialog.find(".exit").click(function(event){
            $("#"+did).remove();
        });
    }

    this.css_dialog = function() {
        /**Dialog */
        var str = "border: 1px solid #C5C5C5; width: "+this.dialog_width+"px; padding: 2px; z-index: 101;background-color: white;";
        str += "top: 20%; left: 0; right: 0; margin: 0 auto; position: fixed; border-radius: 4px;";
        this.css_from_style_strings(this.odialog, str);

        /**Head */
        str = "background-color: #D5D4D4; height: 30px; border-top-left-radius: 4px; border-top-right-radius: 4px; display: table-cell; vertical-align: middle; width: "
                    +(this.dialog_width-5)+"px; ";
        str += "padding-left:5px; padding-right:5px; ";
        this.css_from_style_strings(this.odialog_head, str);
        str = "float: left;";
        this.css_from_style_strings(this.odialog_head.find(".title"), str);
        str = "float: right;";
        this.css_from_style_strings(this.odialog_head.find("button"), str);

        /**Body */
        str = "";
        this.css_from_style_strings(this.odialog_body, str);

        /**Foot */
        str = "float: right; margin-right:10px; margin-top:10px; margin-bottom: 5px;";
        this.css_from_style_strings(this.odialog_foot.find("button"), str);
    }

    this.set_dialog_vertical_center = function() {
        var wh = $(window).height();
        var dh = this.odialog.outerHeight();
        var bl = ((wh/2-dh/2)/(wh))*100 - 10;
        // console.info("dh:"+dh+"    "+bl);
        var str = "top: "+bl+"%;";
        this.css_from_style_strings(this.odialog, str);
    }

    this.cdialog = function() {
        this.odialog = this.cele("div").attr("id", this.sdialog_id);
        this.odialog_head = this.cele("div").addClass("head");
        this.odialog_head.append(this.cele("span").addClass("title").text(this.dialog_title));
        this.odialog_head.append(this.cele("button").addClass("exit").text("X"));

        this.odialog_body = this.cele("div").addClass("body");

        this.odialog_foot = this.cele("div").addClass("foot");
        this.odialog_foot.append(this.cele("button").addClass("exit").text("Cancle"));
        this.odialog_foot.append(this.cele("button").addClass("confirn").text("OK"));
        
        
        this.odialog.append(this.odialog_head);
        this.odialog.append(this.odialog_body);
        this.odialog.append(this.odialog_foot);
        $("body").append(this.odialog);
        this.dialog_event();
        this.css_dialog();
    }

    this.main = function() {
        this.sdialog_id = this.UUID(10, 100);
        this.cdialog();
        this.set_dialog_vertical_center();
    }
    this.main();
}





































