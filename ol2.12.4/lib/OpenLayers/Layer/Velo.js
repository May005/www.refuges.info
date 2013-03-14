/*DCM++ � Dominique Cavailhez 2012.
 * Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of the license. */

/**
 * @requires OpenLayers/Layer/OSM.js
 * @requires OpenLayers/Layer/XYZ.js
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.Velo
 * Create a opencyclemap layer
 *
 * Inherits from:
 *  - <OpenLayers.Layer.OSM>
 */
 
OpenLayers.Layer.Velo = OpenLayers.Class(OpenLayers.Layer.OSM, {

	url: 'http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png',

    initialize: function(name) { // OpenLayers.Layer.OSM ne comporte pas de m�thode initialize,
        OpenLayers.Layer.XYZ.prototype.initialize.call( // il faut donc appeler la classe dont il h�rite
			this, name, null, {numZoomLevels: 19} // Il faut forcer zoom comme �a, sinon XYZ.initialize l'�crase
		);
    },
	
	attribution:
		'<a class="DCattribution" style="color:white;background-color:#666" href="http://opencyclemap.org/">Opencyclemap.Org</a>&nbsp;'+
		OpenLayers.Layer.OSM.prototype.attribution,

    CLASS_NAME: "OpenLayers.Layer.Velo"
});
