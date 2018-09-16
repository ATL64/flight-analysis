/*
################ FORMATS ##################
-------------------------------------------
*/


var 	formatAsPercentage = d3.format("%"),
		formatAsPercentage1Dec = d3.format(".1%"),
		formatAsInteger = d3.format(","),
		fsec = d3.time.format("%S s"),
		fmin = d3.time.format("%M m"),
		fhou = d3.time.format("%H h"),
		fwee = d3.time.format("%a"),
		fdat = d3.time.format("%d d"),
		fmon = d3.time.format("%b")
		;

/*
############# PIE CHART ###################
-------------------------------------------
*/



function dsPieChart(){

	var dataset = [
			{ category: "B" , measure: 0.399493575097865},
            { category: "A" , measure: 0.395317024899224},
            { category: "C" , measure: 0.205102085364611},
            { category: "D" , measure: 8.73146382991108e-05}
	      ]
	      ;

	var 	width = 400,
		   height = 400,
		   outerRadius = Math.min(width, height) / 2,
		   innerRadius = outerRadius * .999,
		   // for animation
		   innerRadiusFinal = outerRadius * .5,
		   innerRadiusFinal3 = outerRadius* .45,
		   color = d3.scale.category20()    //builtin range of colors
		   ;

	var vis = d3.select("#pieChart")
	     .append("svg:svg")              //create the SVG element inside the <body>
	     .data([dataset])                   //associate our data with the document
	         .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
	         .attr("height", height)
	     		.append("svg:g")                //make a group to hold our pie chart
	         .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
				;

   var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        	.outerRadius(outerRadius).innerRadius(innerRadius);

   // for animation
   var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
	var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

   var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

   var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
               .attr("class", "slice")    //allow us to style things in the slices (like text)
               .on("mouseover", mouseover)
    				.on("mouseout", mouseout)
    				.on("click", up)
    				;

        arcs.append("svg:path")
               .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
               .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
					.append("svg:title") //mouseover title showing the figures
				   .text(function(d) { return d.data.category + ": " + formatAsPercentage(d.data.measure); });

        d3.selectAll("g.slice").selectAll("path").transition()
			    .duration(750)
			    .delay(10)
			    .attr("d", arcFinal )
			    ;

	  // Add a label to the larger arcs, translated to the arc centroid and rotated.
	  // source: http://bl.ocks.org/1305337#index.html
	  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
	  		.append("svg:text")
	      .attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
	      //.text(function(d) { return formatAsPercentage(d.value); })
	      .text(function(d) { return d.data.category; })
	      ;

	   // Computes the label angle of an arc, converting from radians to degrees.
		function angle(d) {
		    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
		    return a > 90 ? a - 180 : a;
		}


		// Pie chart title
		vis.append("svg:text")
	     	.attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .text("Cancellation Codes 2008")
	      .attr("class","title")
	      ;



	function mouseover() {
	  d3.select(this).select("path").transition()
	      .duration(750)
	        		//.attr("stroke","red")
	        		//.attr("stroke-width", 1.5)
	        		.attr("d", arcFinal3)
	        		;
	}

	function mouseout() {
	  d3.select(this).select("path").transition()
	      .duration(750)
	        		//.attr("stroke","blue")
	        		//.attr("stroke-width", 1.5)
	        		.attr("d", arcFinal)
	        		;
	}

	function up(d, i) {

				/* update bar chart when user selects piece of the pie chart */
				//updateBarChart(dataset[i].category);
				updateBarChart(d.data.category, color(i));
				updateLineChart(d.data.category, color(i));

	}
}

dsPieChart();

/*
############# BAR CHART ###################
-------------------------------------------
*/



var datasetBarChart = [{ group: "A" , category: "1" , measure: 8198},
                       { group: "All" , category: "1" , measure: 20513},
                       { group: "B" , category: "1" , measure: 7254},
                       { group: "C" , category: "1" , measure: 5061},
                       { group: "A" , category: "2" , measure: 8622},
                       { group: "All" , category: "2" , measure: 23168},
                       { group: "B" , category: "2" , measure: 9445},
                       { group: "C" , category: "2" , measure: 5099},
                       { group: "D" , category: "2" , measure: 2},
                       { group: "A" , category: "3" , measure: 9696},
                       { group: "All" , category: "3" , measure: 20202},
                       { group: "B" , category: "3" , measure: 6972},
                       { group: "C" , category: "3" , measure: 3530},
                       { group: "D" , category: "3" , measure: 4},
                       { group: "A" , category: "4" , measure: 8584},
                       { group: "All" , category: "4" , measure: 17884},
                       { group: "B" , category: "4" , measure: 5895},
                       { group: "C" , category: "4" , measure: 3403},
                       { group: "D" , category: "4" , measure: 2},
                       { group: "A" , category: "5" , measure: 7680},
                       { group: "All" , category: "5" , measure: 23962},
                       { group: "B" , category: "5" , measure: 10909},
                       { group: "C" , category: "5" , measure: 5372},
                       { group: "D" , category: "5" , measure: 1},
                       { group: "A" , category: "6" , measure: 5277},
                       { group: "All" , category: "6" , measure: 13567},
                       { group: "B" , category: "6" , measure: 6700},
                       { group: "C" , category: "6" , measure: 1587},
                       { group: "D" , category: "6" , measure: 3},
                       { group: "A" , category: "7" , measure: 6273},
                       { group: "All" , category: "7" , measure: 18138},
                       { group: "B" , category: "7" , measure: 7729},
                       { group: "C" , category: "7" , measure: 4136}
]
;

// set initial group value
var group = "All";

function datasetBarChosen(group) {
	var ds = [];
	for (x in datasetBarChart) {
		 if(datasetBarChart[x].group==group){
		 	ds.push(datasetBarChart[x]);
		 }
		}
	return ds;
}


function dsBarChartBasics() {

		var margin = {top: 30, right: 5, bottom: 20, left: 50},
		width = 500 - margin.left - margin.right,
	   height = 250 - margin.top - margin.bottom,
		colorBar = d3.scale.category20(),
		barPadding = 1
		;

		return {
			margin : margin,
			width : width,
			height : height,
			colorBar : colorBar,
			barPadding : barPadding
		}
		;
}

function dsBarChart() {

	var firstDatasetBarChart = datasetBarChosen(group);

	var basics = dsBarChartBasics();

	var margin = basics.margin,
		width = basics.width,
	   height = basics.height,
		colorBar = basics.colorBar,
		barPadding = basics.barPadding
		;

	var 	xScale = d3.scale.linear()
						.domain([0, firstDatasetBarChart.length])
						.range([0, width])
						;

	// Create linear y scale
	// Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
	// get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.
	var yScale = d3.scale.linear()
			// use the max funtion to derive end point of the domain (max value of the dataset)
			// do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
		   .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
		   // As coordinates are always defined from the top left corner, the y position of the bar
		   // is the svg height minus the data value. So you basically draw the bar starting from the top.
		   // To have the y position calculated by the range function
		   .range([height, 0])
		   ;

	//Create SVG element

	var svg = d3.select("#barChart")
			.append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .attr("id","barChartPlot")
		    ;

	var plot = svg
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		    ;

	plot.selectAll("rect")
		   .data(firstDatasetBarChart)
		   .enter()
		   .append("rect")
			.attr("x", function(d, i) {
			    return xScale(i);
			})
		   .attr("width", width / firstDatasetBarChart.length - barPadding)
			.attr("y", function(d) {
			    return yScale(d.measure);
			})
			.attr("height", function(d) {
			    return height-yScale(d.measure);
			})
			.attr("fill", "lightgrey")
			;


	// Add y labels to plot

	plot.selectAll("text")
	.data(firstDatasetBarChart)
	.enter()
	.append("text")
	.text(function(d) {
			return formatAsInteger(d3.round(d.measure));
	})
	.attr("text-anchor", "middle")
	// Set x position to the left edge of each bar plus half the bar width
	.attr("x", function(d, i) {
			return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
	})
	.attr("y", function(d) {
			return yScale(d.measure) + 14;
	})
	.attr("class", "yAxis")
	/* moved to CSS
	.attr("font-family", "sans-serif")
	.attr("font-size", "11px")
	.attr("fill", "white")
	*/
	;

	// Add x labels to chart

	var xLabels = svg
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
		    ;

	xLabels.selectAll("text.xAxis")
		  .data(firstDatasetBarChart)
		  .enter()
		  .append("text")
		  .text(function(d) { return d.category;})
		  .attr("text-anchor", "middle")
			// Set x position to the left edge of each bar plus half the bar width
						   .attr("x", function(d, i) {
						   		return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
						   })
		  .attr("y", 15)
		  .attr("class", "xAxis")
		  //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
		  ;

	// Title

	svg.append("text")
		.attr("x", (width + margin.left + margin.right)/2)
		.attr("y", 15)
		.attr("class","title")
		.attr("text-anchor", "middle")
		.text("Cancellations by Day Of Week")
		;
}

dsBarChart();

 /* ** UPDATE CHART ** */

/* updates bar chart on request */

function updateBarChart(group, colorChosen) {

		var currentDatasetBarChart = datasetBarChosen(group);

		var basics = dsBarChartBasics();

		var margin = basics.margin,
			width = basics.width,
		   height = basics.height,
			colorBar = basics.colorBar,
			barPadding = basics.barPadding
			;

		var 	xScale = d3.scale.linear()
			.domain([0, currentDatasetBarChart.length])
			.range([0, width])
			;


		var yScale = d3.scale.linear()
	      .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
	      .range([height,0])
	      ;

	   var svg = d3.select("#barChart svg");

	   var plot = d3.select("#barChartPlot")
	   	.datum(currentDatasetBarChart)
		   ;

	  		/* Note that here we only have to select the elements - no more appending! */
	  	plot.selectAll("rect")
	      .data(currentDatasetBarChart)
	      .transition()
			.duration(750)
			.attr("x", function(d, i) {
			    return xScale(i);
			})
		   .attr("width", width / currentDatasetBarChart.length - barPadding)
			.attr("y", function(d) {
			    return yScale(d.measure);
			})
			.attr("height", function(d) {
			    return height-yScale(d.measure);
			})
			.attr("fill", colorChosen)
			;

		plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
			.data(currentDatasetBarChart)
			.transition()
			.duration(750)
		   .attr("text-anchor", "middle")
		   .attr("x", function(d, i) {
		   		return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
		   })
		   .attr("y", function(d) {
		   		return yScale(d.measure) + 14;
		   })
		   .text(function(d) {
				return formatAsInteger(d3.round(d.measure));
		   })
		   .attr("class", "yAxis")
		;


		svg.selectAll("text.title") // target the text element(s) which has a title class defined
			.attr("x", (width + margin.left + margin.right)/2)
			.attr("y", 15)
			.attr("class","title")
			.attr("text-anchor", "middle")
			.text(group + "'s Cancellations by Day Of Week")
		;
}


/*
############# LINE CHART ##################
-------------------------------------------
*/

var datasetLineChart = [{ group: "A" , category: "1" , measure: 6635},
                        { group: "All" , category: "1" , measure: 17308},
                        { group: "B" , category: "1" , measure: 6711},
                        { group: "C" , category: "1" , measure: 3962},
                        { group: "A" , category: "2" , measure: 6090},
                        { group: "All" , category: "2" , measure: 20596},
                        { group: "B" , category: "2" , measure: 10034},
                        { group: "C" , category: "2" , measure: 4470},
                        { group: "D" , category: "2" , measure: 2},
                        { group: "A" , category: "3" , measure: 6038},
                        { group: "All" , category: "3" , measure: 16183},
                        { group: "B" , category: "3" , measure: 7520},
                        { group: "C" , category: "3" , measure: 2621},
                        { group: "D" , category: "3" , measure: 4},
                        { group: "A" , category: "4" , measure: 7312},
                        { group: "All" , category: "4" , measure: 10355},
                        { group: "B" , category: "4" , measure: 1479},
                        { group: "C" , category: "4" , measure: 1564},
                        { group: "A" , category: "5" , measure: 3157},
                        { group: "All" , category: "5" , measure: 6229},
                        { group: "B" , category: "5" , measure: 1461},
                        { group: "C" , category: "5" , measure: 1608},
                        { group: "D" , category: "5" , measure: 3},
                        { group: "A" , category: "6" , measure: 4251},
                        { group: "All" , category: "6" , measure: 10931},
                        { group: "B" , category: "6" , measure: 3448},
                        { group: "C" , category: "6" , measure: 3232},
                        { group: "A" , category: "7" , measure: 5292},
                        { group: "All" , category: "7" , measure: 10598},
                        { group: "B" , category: "7" , measure: 2612},
                        { group: "C" , category: "7" , measure: 2694},
                        { group: "A" , category: "8" , measure: 3852},
                        { group: "All" , category: "8" , measure: 9835},
                        { group: "B" , category: "8" , measure: 3582},
                        { group: "C" , category: "8" , measure: 2401},
                        { group: "A" , category: "9" , measure: 2246},
                        { group: "All" , category: "9" , measure: 9913},
                        { group: "B" , category: "9" , measure: 6478},
                        { group: "C" , category: "9" , measure: 1188},
                        { group: "D" , category: "9" , measure: 1},
                        { group: "A" , category: "10" , measure: 2097},
                        { group: "All" , category: "10" , measure: 3249},
                        { group: "B" , category: "10" , measure: 600},
                        { group: "C" , category: "10" , measure: 552},
                        { group: "A" , category: "11" , measure: 2510},
                        { group: "All" , category: "11" , measure: 4458},
                        { group: "B" , category: "11" , measure: 937},
                        { group: "C" , category: "11" , measure: 1009},
                        { group: "D" , category: "11" , measure: 2},
                        { group: "A" , category: "12" , measure: 4850},
                        { group: "All" , category: "12" , measure: 17779},
                        { group: "B" , category: "12" , measure: 10042},
                        { group: "C" , category: "12" , measure: 2887}


]
;

// set initial category value
var group = "All";

function datasetLineChartChosen(group) {
	var ds = [];
	for (x in datasetLineChart) {
		 if(datasetLineChart[x].group==group){
		 	ds.push(datasetLineChart[x]);
		 }
		}
	return ds;
}

function dsLineChartBasics() {

	var margin = {top: 20, right: 10, bottom: 0, left: 50},
	    width = 500 - margin.left - margin.right,
	    height = 150 - margin.top - margin.bottom
	    ;

		return {
			margin : margin,
			width : width,
			height : height
		}
		;
}


function dsLineChart() {

	var firstDatasetLineChart = datasetLineChartChosen(group);

	var basics = dsLineChartBasics();

	var margin = basics.margin,
		width = basics.width,
	   height = basics.height
		;

	var xScale = d3.scale.linear()
	    .domain([0, firstDatasetLineChart.length-1])
	    .range([0, width])
	    ;

	var yScale = d3.scale.linear()
	    .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.measure; })])
	    .range([height, 0])
	    ;

	var line = d3.svg.line()
	    //.x(function(d) { return xScale(d.category); })
	    .x(function(d, i) { return xScale(i); })
	    .y(function(d) { return yScale(d.measure); })
	    ;

	var svg = d3.select("#lineChart").append("svg")
	    .datum(firstDatasetLineChart)
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    // create group and move it so that margins are respected (space for axis and title)

	var plot = svg
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .attr("id", "lineChartPlot")
	    ;

		/* descriptive titles as part of plot -- start */
	var dsLength=firstDatasetLineChart.length;

	plot.append("text")
		.text(firstDatasetLineChart[dsLength-1].measure)
		.attr("id","lineChartTitle2")
		.attr("x",width/2)
		.attr("y",height/2)
		;
	/* descriptive titles -- end */

	plot.append("path")
	    .attr("class", "line")
	    .attr("d", line)
	    // add color
		.attr("stroke", "lightgrey")
	    ;

	plot.selectAll(".dot")
	    .data(firstDatasetLineChart)
	  	 .enter().append("circle")
	    .attr("class", "dot")
	    //.attr("stroke", function (d) { return d.measure==datasetMeasureMin ? "red" : (d.measure==datasetMeasureMax ? "green" : "steelblue") } )
	    .attr("fill", function (d) { return d.measure==d3.min(firstDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(firstDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
	    //.attr("stroke-width", function (d) { return d.measure==datasetMeasureMin || d.measure==datasetMeasureMax ? "3px" : "1.5px"} )
	    .attr("cx", line.x())
	    .attr("cy", line.y())
	    .attr("r", 3.5)
	    .attr("stroke", "lightgrey")
	    .append("title")
	    .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })
	    ;

	svg.append("text")
		.text("Monthly Cancellations 2018")
		.attr("id","lineChartTitle1")
		.attr("x",margin.left + ((width + margin.right)/2))
		.attr("y", 10)
		;

}

dsLineChart();


 /* ** UPDATE CHART ** */

/* updates bar chart on request */
function updateLineChart(group, colorChosen) {

	var currentDatasetLineChart = datasetLineChartChosen(group);

	var basics = dsLineChartBasics();

	var margin = basics.margin,
		width = basics.width,
	   height = basics.height
		;

	var xScale = d3.scale.linear()
	    .domain([0, currentDatasetLineChart.length-1])
	    .range([0, width])
	    ;

	var yScale = d3.scale.linear()
	    .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.measure; })])
	    .range([height, 0])
	    ;

	var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.measure); })
    ;

   var plot = d3.select("#lineChartPlot")
   	.datum(currentDatasetLineChart)
	   ;

	/* descriptive titles as part of plot -- start */
	var dsLength=currentDatasetLineChart.length;

	plot.select("text")
		.text(currentDatasetLineChart[dsLength-1].measure)
		;
	/* descriptive titles -- end */

	plot
	.select("path")
		.transition()
		.duration(750)
	   .attr("class", "line")
	   .attr("d", line)
	   // add color
		.attr("stroke", colorChosen)
	   ;

	var path = plot
		.selectAll(".dot")
	   .data(currentDatasetLineChart)
	   .transition()
		.duration(750)
	   .attr("class", "dot")
	   .attr("fill", function (d) { return d.measure==d3.min(currentDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
	   .attr("cx", line.x())
	   .attr("cy", line.y())
	   .attr("r", 3.5)
	   // add color
		.attr("stroke", colorChosen)
	   ;

	   path
	   .selectAll("title")
	   .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })
	   ;

}