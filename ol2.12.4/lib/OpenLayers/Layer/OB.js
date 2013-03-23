/*DCM++ � Dominique Cavailhez / YIP 2013
 * Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/OSM.js
 */

/**
 * Class: OpenLayers.Layer.OB
 * Create a http://maps.oberbayern.de layer
 * Pas d'enregistrement demand�
 *
 * Inherits from:
 *  - <OpenLayers.Layer.OSM>
 */
 
OpenLayers.Layer.OB = OpenLayers.Class(OpenLayers.Layer.OSM, {

	url:  [
		'http://at0.cdn.ecmaps.de/WmsGateway.ashx.jpg?Experience=oberbayern&MapStyle=KOMPASS&TileX=${x}&TileY=${y}&ZoomLevel=${z}',
		'http://at1.cdn.ecmaps.de/WmsGateway.ashx.jpg?Experience=oberbayern&MapStyle=KOMPASS&TileX=${x}&TileY=${y}&ZoomLevel=${z}',
		'http://at2.cdn.ecmaps.de/WmsGateway.ashx.jpg?Experience=oberbayern&MapStyle=KOMPASS&TileX=${x}&TileY=${y}&ZoomLevel=${z}',
		'http://at3.cdn.ecmaps.de/WmsGateway.ashx.jpg?Experience=oberbayern&MapStyle=KOMPASS&TileX=${x}&TileY=${y}&ZoomLevel=${z}',
	],
	
    initialize: function(name) { // OpenLayers.Layer.OSM ne comporte pas de m�thode initialize, 
        OpenLayers.Layer.XYZ.prototype.initialize.call( //il faut donc appeler la classe dont il h�rite
			this, name, null, {numZoomLevels: 16} // Il faut forcer zoom comme �a, sinon XYZ.initialize l'�crase
		);
    },
	
	attribution:
		'<a href="http://maps.oberbayern.de/" title="Source" style="position:relative;bottom:-10px;">'+
			'<img src="http://maps.hubermedia.de/samples/oberbayern.png" />'+
		'</a> '+
		'<a href="http://oberbayern.de/de/impressum">'+
			'Conditions d\'utilisations'+
		'</a>',

    CLASS_NAME: "OpenLayers.Layer.OB"
});
