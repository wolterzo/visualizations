function makeGraph(data,category) {
	d3.selectAll("div > *").remove();
			var displayNames = {}
		displayNames['classes'] = {e: 'edible', p: 'poisonous'};
		displayNames['cap-shape'] = {b: 'Bell', c: 'Conical', x: 'Convex', f: 'Flat', k: 'Knobbed', s: 'Sunken'};
		displayNames['cap-surface'] = {f: 'Fibrous', g: 'Grooves', y: 'Scaly', s: 'Smooth'};
		displayNames['cap-color'] = {n:'Brown',b:'Buff',c:'Cinnamon',g:'Gray',r:'Green',p:'Pink',u:'Purple',e:'Red',w:'White', y:'Yellow'};
		displayNames['bruises'] = {t: "Yes", f: "No"};
		displayNames['odor'] = {a:'Almond',l:'Anise',c:'Creosote',y:'Fishy',f:'Foul',m:'Musty',n:'None',p:'Pungent',s:'Spicy'}
		displayNames['gill-attachment'] = {a:'Attached',d:"Descending",f:"Free",n:"Notched"};
		displayNames['gill-spacing'] = {c:"Close",w:"Crowded",d:"Distant"};
		displayNames['gill-size'] = {b:"Broad", n: "Narrow"};
		displayNames['gill-color'] = {k:'Black',n:'Brown',b:'Buff',h:"Chocolate",g:"Gray",r:"Green",o:"Orange",p:"Pink",u:"Purple",e:"Red",w:"White",y:"Yellow"};
		displayNames['stalk-shape'] = {e:"Enlarging", t:"Tapering"};
		displayNames['stalk-root'] = {b:"Bulbous",c:"Club",u:"Cup",e:"Equal",z:"Rhizomorphs",r:"Rooted",'?':"Missing"};
		displayNames['stalk-surface-above-ring'] = {f:"Fibrous",y:"Scaly",k:"Silky",s:"Smooth"};
		displayNames['stalk-surface-below-ring'] = {f:"Fibrous",y:"Scaly",k:"Silky",s:"Smooth"};
		displayNames['stalk-color-above-ring'] = {n:"Brown",b:"Buff",c:"Cinnamon",g:"Gray",o:"Orange",p:"Pink",e:"Red",w:"White",y:"Yellow"};
		displayNames['stalk-color-below-ring'] = {n:"Brown",b:"Buff",c:"Cinnamon",g:"Gray",o:"Orange",p:"Pink",e:"Red",w:"White",y:"Yellow"};
		displayNames['veil-type'] = {p:"Partial",u:"Universal"};
		displayNames['veil-color'] = {n:"Brown",o:"Orange",w:"White",y:"Yellow"};
		displayNames['ring-number'] = {n:"None",o:"One",t:"Two"};
		displayNames['ring-type'] = {c:"Cobwebby",e:"Evanescent",f:"Flaring",l:"Large",n:"None",p:"Pendant",s:"Sheathing",z:"Zone"};
		displayNames['spore-print-color'] = {k:'Black',n:'Brown',b:'Buff',h:"Chocolate",r:"Green",o:"Orange",u:"Purple",w:"White",y:"Yellow"};
		displayNames['population'] = {a:"Abundant",c:"Clustered",n:"Numerous",s:"Scattered",v:"Several",y:"Solitary"};
		displayNames['habitat'] = {g:"Grasses",l:"Leaves",m:"Meadows",p:"Paths",u:"Urban",w:"Waste",d:"Woods"};


	var width = 1400;

	var margin = {top: 20, bottom: 0, left: 10, right: 10};

	var dotRadius = 6;
	var dotPadding = 2;
	var columnMargin = 20;
	var categories = Object.keys(displayNames[category]).map(function(key) { return key})

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
	var xScale = d3.scalePoint()
		.domain(categories)
		.range([margin.left,width-margin.right])
		.align(0)
		.padding(columnMargin);

	var noOfCirclesInARow = Math.floor(xScale.step() / (dotRadius*2 + dotPadding*2));

	var maxNoOfLinesInGroup = 0;
	for(var group in sumOfEveryGroup) {
		if(sumOfEveryGroup[group]['total']/noOfCirclesInARow > maxNoOfLinesInGroup) {
			maxNoOfLinesInGroup = Math.ceil(sumOfEveryGroup[group]['total']/noOfCirclesInARow);
		}
	}
	var numberOfLines = maxNoOfLinesInGroup;
	var height = numberOfLines * (dotRadius*2 + dotPadding);


	var svg = d3.select('#mushroomChart')
				.append('svg')
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom + 45)
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
		return 45+dotRadius + row * (dotRadius*2 +dotPadding);
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
				if(d['class'] == 'p') {
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
			.text( function(d) { return displayNames[category][d]; })
			.attr("x", function(d) {return xScale(d)})
			.attr("y", 20)
	svg.append("g")
		.selectAll("text")
		.data(categories)
		.enter()
		.append("text")
			.text (function(d) {
				if (sumOfEveryGroup[d] != null) {
					var poisonous = Math.round((sumOfEveryGroup[d]['poisonous']/sumOfEveryGroup[d]['total'])*100);
				} else {
					var poisonous = 0;
				}
				return poisonous +"% poison";
			})
			.attr("x", function(d) {return xScale(d)})
			.attr("y", 40)
return svg;

}