# Customizing PI Vision with Extensibility course
This course delivers a certificate. To get the certificate a [Final Project](Final%20Project%20-%20Create%20your%20Custom%20PI%20Vision%20Symbols%20or%20Tool%20Panes) had to be submitted.

Final Project - ESRI ArcGIS Custom PI Vision symbol
-----------------------------------

This experiment shows how to integrate ESRI ArcGIS API for JavaScript with [OSISoft PI System](https://www.osisoft.com/pi-system/) data.

The `symbol lm_final_project` makes use of the following libraries:

- ESRI ArcGIS API for JavaScript version 4.10

https://developers.arcgis.com/javascript/index.html

- Calcite Maps [ A Bootstrap theme for designing, styling and creating modern map apps ]

https://github.com/Esri/calcite-maps

### 1 - Installation

Move the files `sym-lm_final_project.js` and `sym-lm_final_project-template.html` to the folder: C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext

Next, add references to the JavaScript libraries.

Note: I had to go a different\unrecommended route. The recommended way is to add external .js file to the folder C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext\libraries. However adding the files into ext\libraries didn't work as can be seen in this question I posted on OSISoft forum:
https://pisquare.osisoft.com/message/127539-is-there-any-way-to-use-require-inside-pi-vision-extension-template

To make it work: open PI Vision `index.cshtml` view file located in C:\Program Files\PIPC\PIVision\Views\Home and add the following code right below the last `@Scripts.Render` call:

```
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
```

You should be good to go.

### 2 - Symbol description
The symbol reads a Tag value\asset called PW17 (screenshot 1).

![screenshot 1](https://github.com/leniel/Customizing-PI-Vision-with-Extensibility/raw/master/Final%20Project%20-%20Create%20your%20Custom%20PI%20Vision%20Symbols%20or%20Tool%20Panes/Screenshots/2019-02-20_11-19-40.png)

Based on the tag's attributes `dLatitude` and `dLongitude` (screenshot 2), a feature\point is added to map. The point is identified by a black circle on the map.

![screenshot 1](https://github.com/leniel/Customizing-PI-Vision-with-Extensibility/raw/master/Final%20Project%20-%20Create%20your%20Custom%20PI%20Vision%20Symbols%20or%20Tool%20Panes/Screenshots/2019-02-20_11-33-36.png)

Clicking on this black circle brings up a popup with more interesting PI data like Gas Volume, Oil Volume and Water Volume along with the GPS coordinates (screenshot 3).

![screenshot 1](https://github.com/leniel/Customizing-PI-Vision-with-Extensibility/raw/master/Final%20Project%20-%20Create%20your%20Custom%20PI%20Vision%20Symbols%20or%20Tool%20Panes/Screenshots/2019-02-20_11-41-37.png)

If you change the Asset in PI Vision sybmbol's dashboard dropdown (screenshot 4), the map will reload with the new Tag coordinates plotted on the map and its corresponding data will be shown in the popup.

![screenshot 1](https://github.com/leniel/Customizing-PI-Vision-with-Extensibility/raw/master/Final%20Project%20-%20Create%20your%20Custom%20PI%20Vision%20Symbols%20or%20Tool%20Panes/Screenshots/2019-02-20_11-44-18.png)

Enjoy!
