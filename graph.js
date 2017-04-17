function makeGraph(data,category) {
	var displayNames = {}
	displayNames['classes'] = {e: 'edible', p: 'poisonous'};
	displayNames['cap-shape'] = {b: 'bell', c: 'conical', x: 'convex', f: 'flat', k: 'knobbed', s: 'sunken'};
	displayNames['cap-surface'] = {f: 'fibrous', g: 'grooves', y: 'scaly', s: 'smooth'};
	displayNames['cap-color'] = { n:'brown',b:'buff',c:'cinnamon',g:'gray',r:'green',p:'pink', u:'purple', e:'red', w:'white', y: 'yellow'}
	var width = 1200;

	var margin = {top: 20, bottom: 0, left: 10, right: 10};

	var dotRadius = 5;
	var dotPadding = 2;
	var columnMargin = 10;
	var categories = Object.keys(displayNames[category]).map(function(key) { return key})
	var noOfCirclesInARow = Math.floor(((width / categories.length) - columnMargin) / (dotRadius*2 + dotPadding*2));
	console.log(noOfCirclesInARow);

	var sumOfEveryGroup = {};
	for(var i=0; i<data.length;i++) {
		if (sumOfEveryGroup[data[i][category]] == null) {
			sumOfEveryGroup[data[i][category]] = {};
			sumOfEveryGroup[data[i][category]]['total'] = 0;
			sumOfEveryGroup[data[i][category]]['edible'] = 0;
			sumOfEveryGroup[data[i][category]]['poisonous'] = 0;
		}
		sumOfEveryGroup[data[i][category]]['total']++;
		if(data[i]['class']=='e') {
			sumOfEveryGroup[data[i][category]]['edible']++;
		} else {
			sumOfEveryGroup[data[i][category]]['poisonous']++;
		}
	}

	var maxNoOfLinesInGroup = 0;
	for(var group in sumOfEveryGroup) {
		if(sumOfEveryGroup[group]['total']/noOfCirclesInARow > maxNoOfLinesInGroup) {
			console.log(Math.ceil(sumOfEveryGroup[group]['total']/noOfCirclesInARow));
			maxNoOfLinesInGroup = Math.ceil(sumOfEveryGroup[group]['total']/noOfCirclesInARow);
		}
	}
	console.log(maxNoOfLinesInGroup);
	var numberOfLines = maxNoOfLinesInGroup;
	var height = numberOfLines * (dotRadius*2 + dotPadding);
	var xScale = d3.scalePoint()
				.domain(categories)
				.range([margin.left,width-margin.left-margin.right])
				.align(0)
				.padding(columnMargin);

	var svg = d3.select('#mushroomChart')
				.append('svg')
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tallyOfGroupsX = {}
	var xOffset = function(d) {
		var group = d[category];
		if(tallyOfGroupsX[group] == null) {
			tallyOfGroupsX[group] = 0;
		}
		x = (tallyOfGroupsX[group]%noOfCirclesInARow)*(dotRadius*2 + dotPadding);
		tallyOfGroupsX[group]++;
		return x;
	}
	var tallyOfGroupsY = {}
	var yRow = function(d) {
		var group = d[category];
		if(tallyOfGroupsY[group] == null) {
			tallyOfGroupsY[group] = 0;
		}
		var row = Math.floor(tallyOfGroupsY[group] / noOfCirclesInARow);
		tallyOfGroupsY[group]++;
		return 25+dotRadius + row * (dotRadius*2 +dotPadding);
	}

	svg.append("g")
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
			.attr("cx", function(d,i) { return xScale(d[category]) + xOffset(d); })
			.attr("cy", function(d,i) { return yRow(d); })
			.attr("r", dotRadius)
			.attr("fill", function(d,i) {
				if(i<sumOfEveryGroup[d[category]]['poisonous']) {
					return "#D60A0A";
				} else {
					return "#159002";
				}
			});
	svg.append("g")
		.selectAll("text")
		.data(categories)
		.enter()
		.append("text")
			.text( function(d) { console.log(displayNames[category][d]); return displayNames[category][d]; })
			.attr("x", function(d) {return xScale(d)})
			.attr("y", 20);
return svg;

}