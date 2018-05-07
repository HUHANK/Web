// window.onload = main;
jQuery(document).ready(function($) {
	main();
});
NowSelItem = '';
G_ALL_DICT = '';


function main(){
	/*--------------------获取初始化的信息----------------------------*/
	var param = new Object();
	param.method = "GET_BASEINFO";
	sync_post_data("/system_set/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			hyl_alert(d.msg);
			return;
		}

		G_ALL_DICT = d.data;
	});

	SidebarEventInit();
	SidebarSizeInit();
	window.onrezie = function() {
		SidebarSizeInit();
	}
}

function SidebarSizeInit() {
	//console.info($(parent.document.body).find(".sjwh"));
	// var h = $(parent.document.body).find(".sjwh").innerHeight() - 4;
	// var w = $(parent.document.body).find(".sjwh").innerWidth();
	//console.info(w);
	// $(".wrap").height(h);
	// $(".wrap .wrap1").height(h);
	// $(".wrap .wrap1").width(w - $(".wrap .sidebar").outerWidth());
	// parent.window.onload = function(){
	// 	var height = $($(this)[0].document.body).find(".sjwh").height();
	// 	$(".wrap").height(height);
	// 	$(".wrap .wrap1").height(height);
	// }
}

function SidebarEventInit(){
	//$(".wrap .wrap1").children('div').css("display", "none");
	/*-----------------------------------------------*/
	NowSelItem = $.cookie('SystemSidebarSelItem')
	if (typeof NowSelItem != 'undefined' && NowSelItem != ''){
		$(".wrap .sidebar .leaf."+NowSelItem).addClass('selected');
		$(".wrap .wrap1 ."+NowSelItem).show(1);
		switch(NowSelItem){
			case 'xzb':
				xzb_init();
				break;
			case 'support':
				support_init();
				break;
		}
	}
	
	/*-----------------------------------------------*/
	$(".sidebar .title").click(function(event) {
		var _speed = 300;
		$(this).next().slideToggle(_speed);
	});

	$(".sidebar .leaf").click(function(event) {
		var sel = $(this).attr("class").split(' ')[1];
		var tmp = ".wrap .wrap1 ."+sel;
		$(".wrap .sidebar .leaf.selected").removeClass('selected');
		$(this).addClass('selected');
		if (NowSelItem == sel || NowSelItem == ''){}
		else{
			$(".wrap .wrap1 ."+NowSelItem).hide(1, function() {});
			// $(".wrap .sidebar .leaf."+NowSelItem).removeClass('selected');
			// $(".wrap .sidebar .leaf."+sel).addClass('selected');
		}
		$(tmp).show(1, function() {});
		NowSelItem = sel;
		$.cookie('SystemSidebarSelItem', NowSelItem);
		switch(NowSelItem){
			case 'xzb':
				xzb_init();
				break;
			case 'support':
				support_init();
				break;
		}
	});

	//组selecte
	var groups = [];
	$(G_ALL_DICT.Group).each(function(index, el) {
		groups[index] = {};
		groups[index]['id'] = el.id;
		groups[index]['name'] = el.name;
	});
	$(".wrap1 .xzyh table input.group").focus(function(event) {
		hyl_select2($(this), groups);
	});
	//创建账户
	$(".wrap1 .xzyh .submit .add").unbind();
	$(".wrap1 .xzyh .submit .add").click(function(event) {
		var param = new Object();
		param.method = "ADD_NEW_USER";
		param.UNAME = $(".wrap1 .xzyh table input.login-account").val();
		if (param.UNAME.length < 1) {
			hyl_alert("登陆账户不能为空!");
			return ;
		}
		var pwd = $(".wrap1 .xzyh table input.login-passwd[type=password]").val();
		if (pwd.length < 1) {
			hyl_alert("密码不能为空!");
			return ;
		}
		var cpwd = $(".wrap1 .xzyh table input.confirm-passwd[type=password]").val();
		if (cpwd.length < 1) {
			hyl_alert("确认密码不能为空!");
			return ;
		}
		if (pwd != cpwd) {
			hyl_alert("密码和确认密码不一致!");
			return;
		}
		param.UPWD = pwd;
		param.NOTE = $(".wrap1 .xzyh table input.user-name").val();
		if (param.NOTE.length < 1) {
			hyl_alert("账户姓名不能为空!");
			return;
		}
		param.REDMINE_UNAME = $(".wrap1 .xzyh table input.rd-uname").val();
		param.REDMINE_UID = $(".wrap1 .xzyh table input.rd-uid").val();
		if (param.REDMINE_UID.length < 1) {
			param.REDMINE_UID = '0';
		}
		if ($(".wrap1 .xzyh .user-type .normal").is(':checked')) {
			param.ADMIN = 0;
		}
		if ($(".wrap1 .xzyh .user-type .admin").is(':checked')) {
			param.ADMIN = 1;
		}

		param.group_id = $(".wrap1 .xzyh table input.group").attr("key");
		if (typeof param.group_id == 'undefined' && param.group_id.length < 1) {
			param.group_id  = 0;
		}

		sync_post_data("/system_set/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				hyl_alert(d.msg);
				return;
			}
			hyl_alert("用户添加成功!");
			$(".wrap1 .xzyh table input.login-account").val('');
			$(".wrap1 .xzyh table input.login-passwd[type=password]").val('');
			$(".wrap1 .xzyh table input.confirm-passwd[type=password]").val('');
			$(".wrap1 .xzyh table input.user-name").val('');
			$(".wrap1 .xzyh table input.rd-uname").val('');
			$(".wrap1 .xzyh table input.rd-uid").val('');
			$(".wrap1 .xzyh table input.group").attr("key",'');
			$(".wrap1 .xzyh table input.group").val('');
		});
	});

	//修改用户密码
	var users = [];
	$(G_ALL_DICT.User).each(function(index, el) {
		users[index] = {};
		users[index].id = el.UID;
		users[index].name = el.NOTE;
	});
	$(".wrap1 .xgmm table input.login-account").focus(function(event) {
		hyl_select2($(this), users);
	});
	$(".wrap1 .xgmm .submit .upt").unbind();
	$(".wrap1 .xgmm .submit .upt").click(function(event) {
		var id = $(".wrap1 .xgmm table input.login-account").attr("key");
		if (typeof id == 'undefined' && id.length < 1) {
			hyl_alert("请选择需要修改的登录帐号!")
			return;
		}
		var oldPwd = $(".wrap1 .xgmm table input.old-pwd[type=password]").val();
		var newPwd = $(".wrap1 .xgmm table input.new-pwd[type=password]").val();
		if (oldPwd.length < 1) {
			hyl_alert("旧密码不能为空!");
			return;
		}
		if (newPwd.length < 1){
			hyl_alert("新密码不能为空!");
			return;
		}
		if (oldPwd == newPwd) {
			hyl_alert("新旧密码一样，无需修改!");
			return;
		}

		var param = new Object();
		param.method = "UPDATE_USER_PWD";
		param.UID =  id;
		param.OldPwd = oldPwd;
		param.NewPwd = newPwd;

		sync_post_data("/system_set/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				hyl_alert(d.msg);
				return;
			}
			hyl_alert("密码修改成功!")
			$(".wrap1 .xgmm table input.login-account").val('');
			$(".wrap1 .xgmm table input.login-account").attr("key", '');
			$(".wrap1 .xgmm table input.old-pwd[type=password]").val('');
			$(".wrap1 .xgmm table input.new-pwd[type=password]").val('');
		});
	});

	//删除用户
	$(".wrap1 .sczh table input.delete-account").focus(function(event) {
		hyl_select2($(this), users);
	});
	$(".wrap1 .sczh table input.join-account").focus(function(event) {
		hyl_select2($(this), users);
	});

	$(".wrap1 .sczh .submit .delete").unbind();
	$(".wrap1 .sczh .submit .delete").click(function(event) {
		var deleteid = $(".wrap1 .sczh table input.delete-account").attr("key");
		var joinid = $(".wrap1 .sczh table input.join-account").attr("key");
		if (typeof deleteid == 'undefined' && deleteid.length < 1) {
			hyl_alert("请选择需要删除的账户!")
			return;
		}
		if (typeof joinid == 'undefined' && joinid.length < 1) {
			joinid = '0';
		}

		var param = {};
		param.method = "DELETE_USER";
		param.DeleteID = deleteid;
		param.JoinID = joinid;
		param.DelAllRec = 0;
		if($(".wrap1 .sczh .option .del-all-rec").is(':checked')){
			param.DelAllRec = 1;
		}

		sync_post_data("/system_set/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0){
				hyl_alert(d.msg)
				return;
			}
			hyl_alert("用户删除成功!");
			$(".wrap1 .sczh table input.delete-account").val('');
			$(".wrap1 .sczh table input.delete-account").attr("key", '');
			$(".wrap1 .sczh table input.join-account").val('');
			$(".wrap1 .sczh table input.join-account").attr('key','');
		});

	});
}

function support_init() {
	var param = new Object();
	param.method = "GET_ALL_DICT"

	sync_post_data("/system_set/", JSON.stringify(param), function(d) {
		console.info(d);
		if (d.ErrCode != 0) {
			alert(d.msg);
			return;
		}
		var sup = d.data.Support;

		var type = '';
		var status = '';
		$(sup).each(function(index, el) {
			if (el.name == "包类型")
				type = el;
			else if (el.name == "状态")
				status = el;
		});

		/*类型*/
		var dom = $(".wrap1 .support .type .body");
		dom.attr("key", ""+ type.id);
		dom.html('');
		$(type.data).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});

		/*状态*/
		var dom = $(".wrap1 .support .statu .body");
		dom.attr("key", ""+ status.id);
		dom.html('');
		$(status.data).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});

		/*单击事件*/
		var dom = $(".wrap1 .support .body .row");
		dom.unbind();
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
		});

		/*双击事件*/
		$(".wrap1 .support .body .row").dblclick(function(event) {
			dblclick_to_edit($(this), dict_item_edit_process);
		});

		/*按钮*/
		$(".wrap1 .support .unit .option button.upt").unbind();
		$(".wrap1 .support .unit .option button.upt").click(function(event) {
			var unit = $(this).parents("div.unit");
			var sel = unit.find(".selected");
			if (sel.length > 0)
				dblclick_to_edit(sel, dict_item_edit_process);
		});

		$(".wrap1 .support .unit .option button.add").unbind();
		$(".wrap1 .support .unit .option button.add").click(function(event) {
			var unit = $(this).parents("div.unit");
			unit.find(".selected").removeClass('selected');
			var ele = $("<p></p>").addClass('row').addClass('selected');
			unit.find(".body").append(ele);

			unit.find(".body").ready(function() {
				dblclick_to_edit(unit.find(".selected"), dict_item_add_process);
			});
		});

		/*删除*/
		$(".wrap1 .support .unit .option button.del").unbind();
		$(".wrap1 .support .unit .option button.del").click(function(event) {
			var row = $(this).parents("div.unit").find(".selected");

			if (row.length < 1) return;

			var canDel = false;
			var param = new Object();
			param.id = row.attr("key");
			param.method = "DEL_DICT_ITEM";
			
			sync_post_data("/system_set/", JSON.stringify(param), function(d) {
				if (d.ErrCode != 0) {
					alert(d.msg);
					return;
				}
				canDel = true;
			});
			if (canDel) {
				row.remove();
			}
		});
		
	});
}

function xzb_init() {
	var param = new Object();
	param.method = "GET_ALL_DICT"

	sync_post_data("/system_set/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			alert(d.msg);
			return;
		}
		var data = d.data;
		var propertys = data['性质'];
		var types = data['类型'];
		var systems = data['系统'];
		/*类型*/
		var dom = $(".wrap1 .xzb .type .body");
		dom.html('');
		$(types).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});
		$(".wrap1 .xzb .type .option button").unbind();
	 	$(".wrap1 .xzb .type .option button").click(function(event) {
			if ($(this).attr("class") == 'add'){
				/*添加*/
				
			}else if ($(this).attr("class") == 'upt'){
				/*跟新*/
				
			}else if ($(this).attr("class") == 'del'){
				/*删除*/

			}
	 	});
		/*性质*/
		var dom = $(".wrap1 .xzb .property .body");
		dom.html('');
		$(propertys).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});

		/*系统*/
		var dom = $(".wrap1 .xzb .system .body");
		dom.html('');
		$(systems).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});

		/*单击事件*/
		var dom = $(".wrap1 .xzb .type .body .row");
		dom.unbind();
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
		});
		var dom = $(".wrap1 .xzb .property .body .row");
		dom.unbind();
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
		});
		var dom = $(".wrap1 .xzb .system .body .row");
		dom.unbind();
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
			var id = $(this).attr("key");

			//$(".wrap1 .xzb .module").hide(1);
			$(".wrap1 .xzb .module .head").text('');
			$(".wrap1 .xzb .module .body").html('');
			$(systems).each(function(index, el) {
				if (el['id'] == id) {
					var dd = el['data']
					$(".wrap1 .xzb .module .head").text(el['name']);
					if (dd.length > 0){
						//$(".wrap1 .xzb .module").show(1);
						$(dd).each(function(index, ell) {
							var tmp = $("<p></p>").text(ell['name']).addClass('row').attr("key", ell['id']);
							$(".wrap1 .xzb .module .body").append(tmp);
						});
						$(".wrap1 .xzb .module").ready(function() {
							$(".wrap1 .xzb .module .body .row").click(function(event) {
								$(this).parent().find(".selected").removeClass('selected');
								$(this).addClass('selected');
							});
							$(".wrap1 .xzb .module .body .row").dblclick(function(event) {
								dblclick_to_edit($(this), dict_item_edit_process);
							});
						});
					}
				}
			});
		});

		/*双击事件*/
		$(".wrap1 .xzb .body .row").dblclick(function(event) {
			dblclick_to_edit($(this), dict_item_edit_process);
		});

		/*按钮*/
		$(".wrap1 .xzb .unit .option button.upt").unbind();
		$(".wrap1 .xzb .unit .option button.upt").click(function(event) {
			var unit = $(this).parents("div.unit");
			var sel = unit.find(".selected");
			if (sel.length > 0)
				dblclick_to_edit(sel, dict_item_edit_process);
		});

		$(".wrap1 .xzb .unit .option button.add").unbind();
		$(".wrap1 .xzb .unit .option button.add").click(function(event) {
			var unit = $(this).parents("div.unit");
			unit.find(".selected").removeClass('selected');
			var ele = $("<p></p>").addClass('row').addClass('selected');
			unit.find(".body").append(ele);

			unit.find(".body").ready(function() {
				dblclick_to_edit(unit.find(".selected"), dict_item_add_process);
			});
		});
		/*删除*/
		$(".wrap1 .xzb .unit .option button.del").unbind();
		$(".wrap1 .xzb .unit .option button.del").click(function(event) {
			var row = $(this).parents("div.unit").find(".selected");

			if (row.length < 1) return;

			var canDel = false;
			var param = new Object();
			param.id = row.attr("key");
			param.method = "DEL_DICT_ITEM";
			
			sync_post_data("/system_set/", JSON.stringify(param), function(d) {
				if (d.ErrCode != 0) {
					alert(d.msg);
					return;
				}
				canDel = true;
			});
			if (canDel) {
				row.remove();
			}
		});
	});
}

function dict_item_add_process(obj, val) {
	var res = true;
	var param = new Object();
	param.method="ADD_DICT_ITEM";

	var unit = $(obj).parents("div.unit");
	var support = unit.parent("div").hasClass('support');
	if (unit.hasClass('type')) {
		if (!support)
			param.parent = 'type';
		else{
			param.parent = $(obj).parent("div.body").attr("key");
		}
	}
	else if (unit.hasClass('property')) {
		param.parent = 'property';
	}
	else if (unit.hasClass('system')) {
		param.parent = 'system';
	}
	else if (unit.hasClass('module')) {
		var sel = $(".wrap1 .xzb .system .body .selected");
		if (sel.length < 1) return false;
		param.parent = 'module';
		param.parent_id = sel.attr("key");
	}
	else if (unit.hasClass('statu')) {
		param.parent = $(obj).parent("div.body").attr("key");
	}
	param.name = val;
	//console.info(param);

	sync_post_data("/system_set/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			alert(d.msg);
			res = false;
			return;
		}

		$(obj).attr("key", d.id);
		$(obj).dblclick(function(event) {
			dblclick_to_edit($(this), dict_item_edit_process);
		});
		$(obj).click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
		});
	});

	return res;
}

function dict_item_edit_process(obj, new_val){
	//console.info("CALLBACK!");
	var param = new Object();
	var res = true;
	param.method = 'UPDATE_DICT_ITEM';
	param.id = $(obj).attr("key");
	param.new_name = new_val;

	sync_post_data("/system_set/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			alert(d.msg);
			res = false;
			return;
		}
	});
	return res;
}

function dblclick_to_edit(obj, callback){
	var _width = $(obj).width();
	var _height = $(obj).height();
	var _text = $(obj).text();
	console.info(_width, _height, _text);

	$(obj).html('');
	var new_input = $('<input class="" type="text" name="">');
	new_input.val(_text);
	new_input.width(_width-2);
	new_input.height(_height-2);

	$(obj).append(new_input);

	$(obj).children('input').ready(function() {
		var _input = $(obj).children('input');
		_input.focus();
		_input.blur(function(event) {
			if (typeof callback != "undefined") {
				if (_text != $(this).val()){
					if (!callback($(obj), $(this).val()) ) {
						$(obj).html("");
						$(obj).text(_text);
						return;
					}
				}
			}
			$(obj).html("");
			$(obj).text($(this).val());
		});
	});
}