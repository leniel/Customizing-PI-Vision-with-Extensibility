(function (PV)
{
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = {
		typeName: "lm_final_project",
		//iconUrl: 'Scripts\\app\\editor\\symbols\\ext\\images\\ts.png',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function ()
		{
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

	function setupEsriMap(points)
	{
		require([
			// ARCGis
			'esri/Map',
			'esri/views/MapView',
			'esri/config',
			'esri/request',
			'esri/geometry/Point',
			'esri/layers/FeatureLayer',
			'esri/renderers/smartMapping/statistics/uniqueValues',
			'esri/renderers/SimpleRenderer',
			'esri/widgets/Legend',

			// Widgets
			'esri/widgets/Home',
			'esri/widgets/Zoom',
			'esri/widgets/Compass',
			'esri/widgets/Search',
			'esri/widgets/Legend',
			'esri/widgets/BasemapToggle',
			'esri/widgets/ScaleBar',
			'esri/widgets/Attribution',

			// Bootstrap
			'bootstrap/Collapse',
			'bootstrap/Dropdown',

			// Calcite Maps
			'calcite-maps/calcitemaps-v0.10',
			// Calcite Maps ArcGIS Support
			'calcite-maps/calcitemaps-arcgis-support-v0.10',

			// Dojo
			'dojo/when',
			'dojo/domReady!'
		], function (EsriMap, EsriMapView, EsriConfig, EsriRequest, EsriPoint, EsriFeatureLayer, EsriUniqueValues, EsriSimpleRenderer, EsriLegend,
			Home, Zoom, Compass, Search, Legend, BasemapToggle, ScaleBar, Attribution, Collapse, Dropdown, CalciteMaps,
			CalciteMapArcGISSupport, when, domReady)
			{
				const map = new EsriMap({ basemap: 'streets-navigation-vector' });

				const mapView = new EsriMapView({
					container: 'mapViewDiv',
					center: [0.1278, 51.5074],
					zoom: 8,
					map: map,
					padding: {
						top: 50,
						bottom: 0
					},
					ui: { components: [] }
				});

				// Search - add to navbar
				const searchWidget = new Search({
					// container: 'searchWidgetDiv',
					view: mapView
				});
				// Add the search widget to the top right corner of the view
				mapView.ui.add(searchWidget, {
					position: 'top-right',
					index: 2
				});

				CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);

				// Popup and panel sync
				mapView.when(function ()
				{
					CalciteMapArcGISSupport.setPopupPanelSync(mapView);
				});

				// Map widgets
				var home = new Home({
					view: mapView
				});
				mapView.ui.add(home, "top-left");

				var zoom = new Zoom({
					view: mapView
				});
				mapView.ui.add(zoom, "top-left");

				var compass = new Compass({
					view: mapView
				});
				mapView.ui.add(compass, "top-left");

				var basemapToggle = new BasemapToggle({
					view: mapView,
					secondBasemap: "satellite"
				});
				mapView.ui.add(basemapToggle, "bottom-right");

				var scaleBar = new ScaleBar({
					view: mapView
				});
				mapView.ui.add(scaleBar, "bottom-left");

				var attribution = new Attribution({
					view: mapView
				});
				mapView.ui.add(attribution, "manual");

				// Panel widgets - add legend
				var legendWidget = new Legend({
					container: "legendDiv",
					view: mapView
				});

				const fields = [
					{
						name: 'ObjectID',
						alias: 'ObjectID',
						type: 'oid'
					},
					// {
					// 	name: 'title',
					// 	alias: 'title',
					// 	type: 'string'
					// },
					{
						name: 'dLatitude',
						alias: 'latitude',
						type: 'double'
					}, {
						name: 'dLongitude',
						alias: 'longitude',
						type: 'double'
					},
					// {
					// 	name: 'sStatus',
					// 	alias: 'status',
					// 	type: 'string'
					// },
					{
						name: 'dOilVolume',
						alias: 'oilVolume',
						type: 'double'
					}, {
						name: 'dGasVolume',
						alias: 'gasVolume',
						type: 'double'
					}, {
						name: 'dWaterVolume',
						alias: 'waterVolume',
						type: 'double'
					}];

				var pointRenderer = {
					type: "simple",  // autocasts as new SimpleRenderer()
					symbol: {
						type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
						size: 20,
						color: "black",
						outline: {  // autocasts as new SimpleLineSymbol()
							width: 0.5,
							color: "white"
						}
					}
				};

				function createSymbol(color)
				{
					return {
						type: 'simple-marker',  // autocasts as new SimpleFillSymbol()
						color: color,
						size: '24px',  // pixels
						outline: {
							width: 0,
							color: [0, 0, 0, 0.1]
						}
					};
				}

				function createFeatures(points)
				{

					// Create an array of Graphics from each GeoJSON feature
					var features = points.map(function (feature, i)
					{
						return {
							geometry: new EsriPoint({
								x: feature.longitude,
								y: feature.latitude
							}),
							// select only the attributes you care about
							attributes: {
								ObjectID: i,
								//title: feature.sWellName,
								dLatitude: parseFloat(feature.latitude),
								dLongitude: parseFloat(feature.longitude),
								// sStatus: feature.sStatus,
								dOilVolume: parseFloat(feature.oilVolume),
								dGasVolume: parseFloat(feature.gasVolume),
								dWaterVolume: parseFloat(feature.waterVolume)
							}
						};
					});

					return features;
				}

				// Set up popup template for the layer
				const pTemplate = {
					// title: '{title}',
					//actions: [chartAction],
					content: [{
						type: 'fields',
						fieldInfos: [{
							fieldName: 'dLatitude',
							label: 'Latitude',
							visible: true
						}, {
							fieldName: 'dLongitude',
							label: 'Longitude',
							visible: true
						},
						{
							fieldName: 'dOilVolume',
							label: 'Oil Volume',
							visible: true
						}, {
							fieldName: 'dGasVolume',
							label: 'Gas Volume',
							visible: true
						}, {
							fieldName: 'dWaterVolume',
							label: 'Water Volume',
							visible: true,
							format: {
								digitSeparator: true,
								places: 0
							}
						}
							//{
							//   fieldName: 'sStatus',
							//   label: 'Status',
							//   visible: true
							//
						]
					}]
				};

				let layer;

				function createLayer(graphics)
				{
					layer = new EsriFeatureLayer({
						source: graphics, // autocast as an array of esri/Graphic
						// create an instance of esri/layers/support/Field for each field object
						fields: fields, // This is required when creating a layer from Graphics
						objectIdField: 'ObjectID', // This must be defined when creating a layer from Graphics
						renderer: pointRenderer, // set the visualization on the layer
						popupTemplate: pTemplate
					});

					map.add(layer);

					// When the layer's promise resolves...
					layer.when(function ()
					{
						// Zoom to extent of all features
						// https://developers.arcgis.com/javascript/latest/sample-code/featurelayer-queryextent/index.html
						mapView.goTo(layer.fullExtent);
					});
				};

				// All resources in the MapView and the map have loaded.
				// Now execute additional processes...
				mapView.when(() =>
				{
					var features = createFeatures(points);

					createLayer(features);
				});

			});
	}

	symbolVis.prototype.init = function (scope, elem)
	{
		this.onDataUpdate = dataUpdate;

		var lat, lon, prevAsset, currentAsset;

		function dataUpdate(data)
		{
			if (!data)
			{
				return;
			}

			//console.log(data);

			// 1st time\sporadic, PI sends labels...
			if (data.Rows[0].Label)
			{
				lat = data.Rows[10].Value; // Latitude
				lon = data.Rows[11].Value; // Longitude

				currentAsset = data.Rows[28].Value; // Asset identifier (unique)

				// Getting point attributes' values...
				var points = [{
					latitude: lat,
					longitude: lon,
					gasVolume: data.Rows[9].Value,
					oilVolume: data.Rows[12].Value,
				  waterVolume: data.Rows[17].Value }];

				// Check if map was loaded already for the asset selected...
				if (currentAsset != prevAsset)
				{
					// Create ESRI Map for the asset...
					setupEsriMap(points);

					prevAsset = currentAsset;
				}
			}
		}
	}

	PV.symbolCatalog.register(definition);

})(window.PIVisualization);
