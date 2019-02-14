(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = {
		typeName: "lm_archivedata",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		getDefaultConfig: function(){ 
			return { 
				Height: 150,
				Width: 150 
			}
		}
	}

	var dataItems = [
		{
			Time: '11-Feb-2019 00:00:00',
			Value: 77
		},
		{
			Time: '12-Feb-2019 00:00:00',
			Value: 777
		}
	];
	

	symbolVis.prototype.init = function(scope, elem) {

		scope.Values = dataItems;

	 };

	PV.symbolCatalog.register(definition);

})(window.PIVisualization); 
