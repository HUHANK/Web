

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


