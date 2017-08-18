window.onload = main;

function main() {
	//test_rect();
	//test_scalar();
	//test_rect_scale();
	test_point_scale();
}

function test_point_scale() {
	var center = [[0.5,0.5],[0.7,0.8],[0.4,0.9],[0.11,0.32],[0.88,0.25],[0.75,0.12],[0.5,0.1],[0.2,0.3],[0.4,0.1],[0.6,0.7]];
	var svg_width = 500;
	var svg_height = 500;
	var padding = {top: 30, left: 50, bottom: 30, right: 30};

	var svg = d3.select("body").append("svg")
		.attr("width", svg_width)
		.attr("height", svg_height);
	console.log(d3.max(d3.max(center)));
	console.log(center.length);

	var xScale = d3.scale.linear()
		.domain([0, d3.max(center, function(d) { return d[0]; })])
		.range([0, (svg_width - padding.right - padding.left)])
		.nice();
	var yScale = d3.scale.linear()
		.domain([0, d3.max(center, function(d) { return d[1]; })])
		.range([(svg_height - padding.top - padding.bottom), 0])
		.nice();

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	//坐标轴
	svg.append("g").attr("class", "axis")
		.attr("transform", "translate("+ padding.left +","+(svg_height - padding.bottom)+")")
		.call(xAxis);
	svg.append("g").attr("class", "axis")
		.attr("transform", "translate("+ padding.left +","+( padding.top )+")")
		.call(yAxis);
	yScale.range([0, (svg_height - padding.top - padding.bottom)]);

	var circle = svg.selectAll("circle").data(center).enter()
		.append("circle")
		.attr("cx", function(d) { return xScale(d[0]); })
		.attr("cy", function(d) { return yScale(d[1]); })
		.attr("r", 2)
		.attr("fill", "black");

	var linePath = d3.svg.line()
		.x(function(d) { return xScale(d[0]); })
		.y(function(d) { return yScale(d[1]); })
		.interpolate("linear")
		;
	svg.append("path")
		.attr("d", linePath(center))
		.attr("stroke", "gray")
		.attr("stroke-width", "1px")
		.attr("fill", "none");
}

function test_rect_scale() {
	var width = 400;
	var height = 400;
	var svg = d3.select("body").append("svg").attr("width", width).attr("height", height)
				.attr("style", "fill:gray");

	var padding = { top: 20, right: 20, bottom: 20, left: 50 };
	

	var xAxisWidth = 300;
	var yAxisWidth = 300;
	var dataset = [50, 43, 120, 87, 99, 167, 142];

	var xScale = d3.scale.ordinal()
		.domain(d3.range(dataset.length))
		.rangeRoundBands([0, xAxisWidth], 0.2);
	var yScale = d3.scale.linear()
		.domain([0, d3.max(dataset)])
		.range([yAxisWidth, 0]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	var yAxis = d3.svg.axis().scale(yScale).orient("left");


	svg.append("g").attr("class", "axis")
		.attr("transform", "translate("+padding.left+", "+(height - padding.bottom)+")")
		.call(xAxis);
	svg.append("g").attr("class", "axis")
		.attr("transform", "translate("+padding.left+","+(height - padding.bottom - yAxisWidth)+")")
		.call(yAxis);
	
	yScale.range([0, yAxisWidth]);
	var rectStep = 41;
	var rectWidth = 20;
	var tmp = (rectStep - rectWidth)/2.0 + 7 
	svg.selectAll("rect").data(dataset).enter().append("rect")
		.attr("x", function(d, i){ return padding.left + tmp + (i)*rectStep; })
		.attr("y", function(d) { return (height - padding.bottom - yScale(d)); })
		.attr("width", rectWidth)
		.attr("height", function(d) { return yScale(d); })
		.attr("fill", "steelblue");

	//console.log(xScale.rangePoints());
	/*
	var rect = svg.selectAll("rect").data(dataset).enter().append("rect")
		.attr("fill", "steelblue")
		.attr("x", function(d, i){ return xScale(padding.left+i*rectStep); })
		.attr("y", function(d) { return yScale(height - padding.bottom - d); })
		.attr("width", xScale(rectWidth))
		.attr("height", function(d) { return yScale(d); });*/
}

function test_scalar() {
	var width = 600;
	var height = 600;
	var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

	var xScale = d3.scale.linear().domain([0, 20]).range([0, 300]);
	var axis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5).tickSize(2,6)
		.tickFormat(d3.format("$0.1f"));
	var gAxis = svg.append("g").attr("transform", "translate(80, 80)").attr("class", "axis");
	axis(gAxis);
}

function test_rect () {
	var width = 400;
	var height = 400;
	var svg = d3.select("body").append("svg").attr("width", width).attr("height", height)
				.attr("style", "fill:gray");

	var padding = { top: 20, right: 20, bottom: 20, left: 20 };
	var rectStep = 35;
	var rectWidth = 30;

	var dataset = [50, 43, 120, 87, 99, 167, 142, 10, 240, 100];
	var rect = svg.selectAll("rect").data(dataset).enter().append("rect")
				.attr("fill", "steelblue")
				.attr("x", function(d, i){ return padding.left+i*rectStep; })
				.attr("y", function(d){ return height - padding.bottom - d; })
				.attr("width", rectWidth)
				.attr("height", function(d){ return d; });


	var text = svg.selectAll("text").data(dataset).enter().append("text")
				.attr("fill", "red")
				.attr("font-size", "14px")
				.attr("text-anchor", "middle")
				.attr("x", function(d, i){ return padding.left + i*rectStep; })
				.attr("y", function(d){ return height - padding.bottom - d; })
				.attr("dx", rectWidth/2)
				.attr("dy", "1em")
				.text( function(d) { return d; });

}