(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = {
		typeName: "lm_amcharts_pidata",
		//iconUrl: 'Scripts\\app\\editor\\symbols\\ext\\images\\ts.png',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function () {
			return {
				DataShape: 'table',
				Height: 150,
				Width: 150,
				// DecimalPlaces: 1,
				// BackgroundColor: 'orange',
				// BorderRadius: 7,
				// FontColor: 'green'
			}
		},
		// configOptions: function () {
		// 	return [{
		// 		title: 'Format Symbol',
		// 		mode: 'format'
		// 	}];
		// }
	}

	function createChart()
		{
			// amcharts theme
			am4core.useTheme(am4themes_animated);

			// Create chart instance
			var chart = am4core.create("chartContainer", am4charts.XYChart);

			// Create axes
			var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "attribute";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;

			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

			// Create series
			var series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "attribute";
			series.name = "Values";
			series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
			series.columns.template.fillOpacity = .8;

			var columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;

			return chart;
		}

	symbolVis.prototype.init = function (scope, elem) {

		this.onDataUpdate = dataUpdate;

		var labels;
		var previousValue = []; // For extra credit

		var chart = createChart();		
		
		function convertoChart(data)
		{		
			// return data.Rows.map(function(item, index)
			// {
			// 	return {
			// 		value: item.Value,
			// 		attribute: labels[index]
			// 	}
			// });
			
			/*** Extra Credit ***/		
			return data.Rows.map(function(item, index)
			{
				if(previousValue[index] == undefined)
				{
					previousValue[index] = 0;
				}
			
				var prevVal = previousValue[index];

				previousValue[index] = item.Value;
			
				return {
					// if current value equals previous value, show it; otherwise show the difference....
					value: item.Value === prevVal ? item.Value : item.Value - prevVal,
					attribute: labels[index]
				}
			});
		}
		
		function updateLabel(data)
		{
			labels = data.Rows.map(function(item)
			{
				return item.Label + ' - ' + item.Units;
			});

			chart.yAxes.values[0].title.text = "See X label";
			chart.yAxes.values[0].fontWeight = "bold";
		}
		
		function dataUpdate(data)
		{
			if(!data)
			{
				return;
			}

			//console.log(data);

			// 1st time\sporadic, let's update the Labels...
			if(data.Rows[0].Label)
			{
				updateLabel(data);
			}

			// If no labels or chart...
			if(!labels || !chart)
			{
				return;
			}
			
			// Convert data from PI System to fit the data shape expected by amcharts...
			var chartData = convertoChart(data);

			//console.log(chartData);

			chart.data = chartData; 

			chart.validateData(); 
		}
	};

	PV.symbolCatalog.register(definition);

})(window.PIVisualization); 
