function box_wrap(s) {
	return '<div id="je-popup-box-wrap">' + s + '</div>';
}


var test_html = ' \
	<div style="text-align: center;"> \
		<div class="je-form-item"> \
			<label class="je-label je-f14">部门</label> \
			<div class="je-inputbox"> \
    			<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input"> \
			</div> \
		</div> \
		<div class="je-form-item"> \
			<label class="je-label je-f14">部门负责人</label> \
			<div class="je-inputbox"> \
    			<input type="text" name="" autocomplete="off" placeholder="请输入" class="je-input"> \
			</div> \
		</div> \
		<button class="je-btn">添加</button> \
	</div> \
	';

test_html = box_wrap(test_html);