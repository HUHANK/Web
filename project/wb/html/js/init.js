function box_wrap(s) {
	return '<div id="je-popup-box-wrap">' + s + '</div>';
}


var bmgl_add_html = ' \
	<div> \
		<div class="je-form-item"> \
			<label class="je-label je-f14">部门</label> \
			<div class="je-inputbox je-w50"> \
    			<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input depart"> \
			</div> \
		</div> \
		<div class="je-form-item"> \
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
		<div class="je-form-item"> \
			<label class="je-label je-f14">部门</label> \
			<div class="je-inputbox"> \
    			<select class="depart"></select>	\
			</div> \
		</div> \
		<div class="je-form-item"> \
			<label class="je-label je-f14">小组名称</label> \
			<div class="je-inputbox je-w50"> \
    			<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input group"> \
			</div> \
		</div> \
		<div class="je-form-item"> \
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

bmgl_add_html = box_wrap(bmgl_add_html);
xzgl_add_html = box_wrap(xzgl_add_html);

var g_ALL_USER = {};
var g_ALL_DEPART = {};