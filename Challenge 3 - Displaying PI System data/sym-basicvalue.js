(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var dataItem = {
		Value: 777,
		Timestamp: "06-Feb-2019 11:09:00"
	};

	var definition = {
		typeName: "basicvalue",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		getDefaultConfig: function(){ 
			return { 
				Height: 150,
				Width: 150 
			}
		}
	}

	symbolVis.prototype.init = function(scope, elem) {

		this.onDataUpdate = dataUpdate;

		function dataUpdate(newData)
		{
			// 1st update is sporadic and has Label and Units
			if(newData.Label)
			{
				scope.Label = newData.Label;
				scope.Units = newData.Units;
			}

			scope.Time = newData.Time;
			scope.Value = newData.Value;
		}
	 };

	PV.symbolCatalog.register(definition);

})(window.PIVisualization); 
