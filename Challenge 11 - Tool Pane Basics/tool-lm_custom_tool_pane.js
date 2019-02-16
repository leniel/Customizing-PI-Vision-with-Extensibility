(function (PV) {
	'use strict';
	var def = {
		typeName: 'lm_custom_tool_pane',
		displayName: 'Display List',
		iconUrl: 'Scripts/app/editor/tools/ext/Icons/eye.png',
		inject: ['$rootScope'],
		init: init
	};

	function init($rootScope) {

		$rootScope.displaypane = {};

		//the base url will include the first 4 '/'s
		//example: https://servername/PIVision/

		//to get the base url, we split the current url by '/'
		//and then combine the first four entries of the array created by splitting the string
		var urlsplit = window.location.href.split('/');

		var visionBaseUrl = '';

		for (var i = 0; i < 4; i++) {
			visionBaseUrl += urlsplit[i] + '/';
		}

		//On page load - get the list of displays available to the user
		$.ajax({
			url: visionBaseUrl + 'Services/Repository',
			type: "GET",
			xhrFields: {
				withCredentials: true
			}
		})
			.done(function (data, textStatus, xhr) {
				//check each display to see if it's open by comparing it's displaylink to the current url
				data.forEach(function (element, index, array) {
					element.IsOpen = window.location.href.includes(element.DisplayLink);
				});

				$rootScope.displaypane.displays = data;
			})
			.fail(function (xhr, textStatus, errorThrown) {
				console.log(xhr.status + '\n' + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
			});

		//filter function for displays
		$rootScope.displaypane.filter = function (item) {
			var q = $rootScope.displaypane.filtertext;

			if (!q) {
				return true;
			}
			else {
				q = q.toLowerCase();

				if (item.Name.toLowerCase().indexOf(q) != -1) {
					return true;
				}
			}

			return false;
		};

		$rootScope.displaypane.switchDisplay = function ($event, display) {
			window.location.href = display.DisplayLink;

			//set the IsOpen flag to true for the clicked display and false for every other display
			$rootScope.displaypane.displays.forEach(function (element, index, array) {
				element.IsOpen = element === display;
			});
		}
	};

	PV.toolCatalog.register(def);

})(window.PIVisualization)