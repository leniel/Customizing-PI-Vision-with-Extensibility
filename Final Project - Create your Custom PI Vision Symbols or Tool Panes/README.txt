Final Project
ESRI ARCGis Custom PI Vision symbol
-----------------------------------

This experiment shows how to integrate ESRI ArcGIS API for JavaScript with PI data.

The symbol lm_final_project makes use of the following libraries:

- ESRI ArcGIS API for JavaScript version 4.10
https://developers.arcgis.com/javascript/index.html

- Calcite Maps [ A Bootstrap theme for designing, styling and creating modern map apps ]
https://github.com/Esri/calcite-maps

1 - Installation

Move the files sym-lm_final_project.js and sym-lm_final_project-template.html to the folder: C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext

Next, add references to the JavaScript libraries. I had to go a different\unrecommended route. The recommended way is to add external .js file to the folder C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext\libraries. However adding the files into ext\libraries didn't work as can be seen in this question I posted on OSISoft forum:
https://pisquare.osisoft.com/message/127539-is-there-any-way-to-use-require-inside-pi-vision-extension-template

To make it work: open PI Vision index.cshtml view file located in C:\Program Files\PIPC\PIVision\Views\Home and add the following code right below the last @Scripts.Render call:

<script type="text/javascript">

var dojoConfig =
{
    async: true,
    packages: [
    {
        name: "bootstrap",
        location: "https://esri.github.io/calcite-maps/dist/vendor/dojo-bootstrap"
    },
    {
        name: "calcite-maps",
        location: "https://esri.github.io/calcite-maps/dist/js/dojo"
    }]
};

</script>
  
<script type="text/javascript" src="https://js.arcgis.com/4.10/" async></script>

You should be good to go.

2 - Symbol description
The symbol reads a Tag value (asset) PW17 (screenshot 1). Based on the tag's attributes dLatitude and dLongitude (screenshot 2), a feature\point is added to map. The point is identified by a black circle on the map. Clicking on this circle brings up a popup with more interesting PI data like Gas Volume, Oil Volume and Water Volume along with the GPS coordinates (screenshot 3).

By changing the Asset in PI Vision dashboard dropdown (screenshot 4), the map reloads with the new Tag coordinates plotted on the map and loads its corresponding data in the popup.