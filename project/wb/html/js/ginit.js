function box_wrap(s) {
	return '<div id="je-popup-box-wrap">' + s + '</div>';
}


var bmgl_add_html = ' \
	<div> \
		<div class="je-form-item bmgl"> \
			<label class="je-label je-f14">部门</label> \
			<div class="je-inputbox je-w50"> \
    			<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input depart"> \
			</div> \
		</div> \
		<div class="je-form-item bmgl"> \
			<label class="je-label je-f14">部门负责人</label> \
			<div class="je-inputbox"> \
    			<!--<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input manager">--> \
    			<select class="manager"></select>	\
			</div> \
		</div> \
		<div class="je-inputbox"> \
		<button class="je-btn submit">添加</button> \
		</div> \
	</div> \
	';
var xzgl_add_html = ' \
		<div class="je-form-item xzgl"> \
			<label class="je-label je-f14">部门</label> \
			<div class="je-inputbox"> \
    			<select class="depart"></select>	\
			</div> \
		</div> \
		<div class="je-form-item xzgl"> \
			<label class="je-label je-f14">小组名称</label> \
			<div class="je-inputbox je-w50"> \
    			<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input group"> \
			</div> \
		</div> \
		<div class="je-form-item xzgl"> \
			<label class="je-label je-f14">部门负责人</label> \
			<div class="je-inputbox"> \
    			<!--<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input manager">--> \
    			<select class="manager"></select>	\
			</div> \
		</div> \
		<div class="je-inputbox"> \
		<button class="je-btn submit">添加</button> \
		</div> \
';

var zdwh_add_html = '\
 <div class="je-form-item zdwh"> \
	<label class="je-label je-f14">父节点</label> \
	<div class="je-inputbox"> \
		<select class="root"></select>	\
	</div> \
</div> \
<div class="je-form-item zdwh"> \
	<label class="je-label je-f14">字典名称</label> \
	<div class="je-inputbox je-w50"> \
		<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input name"> \
	</div> \
</div> \
<div class="je-form-item zdwh"> \
	<label class="je-label je-f14">根节点</label> \
	<div class="je-inputbox"> \
		<select class="isroot">\
			<option name="1">是</option><option name="0">否</option> \
		</select>	\
	</div> \
</div> \
<div class="je-inputbox"> \
	<button class="je-btn submit">添加</button> \
</div> \
';

bmgl_add_html = box_wrap(bmgl_add_html);
xzgl_add_html = box_wrap(xzgl_add_html);
zdwh_add_html = box_wrap(zdwh_add_html);

var g_ALL_USER = [];
var g_ALL_DEPART = [];
var g_ALL_GROUP = [];
var g_ALL_SYSTEM = {};
var g_ALL_TYPE = {};
var g_ALL_PROPERTY = {};

var g_QUERY_TREE;
var g_CURRENT_WEEK = 0;
var g_CURRENT_USER = "";
var g_CURRENT_YEAR = 0;
var g_CURRENT_QPAGE = 0;
var g_CURRENT_USER_IS_ADMIN = 0;

var g_SUPPORT_PACKAGE_NAMES = [];

Options = new Object();
Options.QueryCondition = new Object();
QueryCondi = Options.QueryCondition;
