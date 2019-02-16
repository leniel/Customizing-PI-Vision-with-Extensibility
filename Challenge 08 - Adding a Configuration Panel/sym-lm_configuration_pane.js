(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = {
		typeName: "lm_configuration_pane",
		//iconUrl: 'Scripts\\app\\editor\\symbols\\ext\\images\\ts.png',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function () {
			return {
				DataShape: 'timeseries',
				Height: 150,
				Width: 150,
				DecimalPlaces: 1,
				BackgroundColor: 'orange',
				BorderRadius: 7,
				FontColor: 'green'
			}
		},
		configOptions: function () {
			return [{
				title: 'Format Symbol',
				mode: 'format'
			}];
		}
	}

	symbolVis.prototype.init = function (scope, elem) {

		this.onDataUpdate = dataUpdate;

		this.onConfigChange = configChange;

		function configChange(oldConfig, newConfig)
		{
			for (var propertyName in newConfig)
			{
				if (oldConfig[propertyName] !== newConfig[propertyName])
				{
					console.log(`${propertyName} Changed: (old) ${oldConfig[propertyName]} vs (new) ${newConfig[propertyName]}`);
				}
			}
		}

		function dataUpdate(newData) {
			if (!newData) {
				return;
			}

			//console.log(newData)

			var first = newData.Data[0];

			scope.Values = first.Values;

			// Sporadic...
			if (first.Label) {
				scope.Label = first.Label;
				scope.Units = first.Units;
			}
		}

	};

	PV.symbolCatalog.register(definition);

})(window.PIVisualization); 
