/*DCM++ � Dominique Cavailhez 2012.
 * Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of the license. */

/**
 * @requires OpenLayers/Control/ArgParser.js
 * @requires OpenLayers/Control/PermalinkCookies.js
 * @requires OpenLayers/Util/Cookies.js
 */

/**
 * Class: OpenLayers.Control.ArgParserCookies
 * Create an instance of OpenLayers.Control.ArgParser that keep lon,lat, zoom & active layers in cookies
 * Internal classe to be created by PermalinkCookies only
 *
 * Inherits from:
 *  - <OpenLayers.ArgParser>
 */

OpenLayers.Control.ArgParserCookies = OpenLayers.Class(OpenLayers.Control.ArgParser, {

    // Param�tres invariants suivant les couches pr�sentes sur les diff�rentes cartes
    scale: null, // L'�ch�le en clair
    baseLayer: null, // La couche de base en clair
    params: {
        defaut: {
            zoom: 6,
            lat: 47,
            lon: 2,
            layers: 'B' // Sinon, n'appelle pas configureLayers
        },
        cookie:    OpenLayers.Util.getParameters ('?'+OpenLayers.Util.readCookie ('params')),
        permalink: OpenLayers.Util.getParameters (window.location.href)
    },

    /**
     * Constructor: OpenLayers.Control.ArgParser
     *
     * Parameters:
     * options - {Object}
     */

    /**
     * Method: getParameters
     */    
    getParameters: function(url) {
        // Ecrase avec les params d�clar�s dans le PermalinkCookies
        var plc = this.map.getControlsByClass ('OpenLayers.Control.PermalinkCookies');
        if (plc.length) {
            OpenLayers.Util.extend (this.params.defaut,    plc[0].defaut);
            OpenLayers.Util.extend (this.params.cookie,    plc[0].cookie);
            OpenLayers.Util.extend (this.params.permalink, plc[0].permalink);
        }
        OpenLayers.Util.extend (this.params.defaut, this.params.cookie);
        OpenLayers.Util.extend (this.params.defaut, this.params.permalink);

        // Evite de restituer une couche hors de ses bornes
        this.map.events.register ('isinvalidbaselayer', this, this.isinvalidbaselayer);

        return this.params.defaut;
    },

    /**
     * Method: getParameters
     * Appel� lors de l'initialisation des layers, choisit la premi�re couche valide
     */    
    isinvalidbaselayer: function (args) {
        if (this.map.initialized) {
            // Enl�ve l'�couteur quand l'initialisation est finie
            this.map.events.unregister ('isinvalidbaselayer', this, this.isinvalidbaselayer);
            return false;
        }
        var extent = args.layer.validExtent
            ? args.layer.validExtent
            : args.layer.maxExtent;
        var pos = new OpenLayers.LonLat (this.params.defaut.lon, this.params.defaut.lat)
                 .transform ('EPSG:4326', args.layer.projection);
        return !extent.containsLonLat (pos);
    },

    /** 
     * Method: configureLayers
     * As soon as all the layers are loaded, cycle through them and hide or show them. 
     */
    configureLayers: function() {
        // Les param�tres scale & baseLayer, ind�pendants des couches, ont priorit�
        if (this.params.defaut.baseLayer) {
            for (var i=0, len=this.map.layers.length; i<len; i++)
                if (this.map.layers[i].isBaseLayer &&
                    this.map.layers[i].name == this.params.defaut.baseLayer) { // Quand on a trouv� la bonne baseLayer
                    this.map.setBaseLayer (this.map.layers[i]); // On la param�tre
                    this.map.events.unregister('addlayer', this, this.configureLayers); // Et on arr�te l�
                }
        }
        else // Si on n'a pas de param�tre, on fait comme d'habitude
            OpenLayers.Control.ArgParser.prototype.configureLayers.apply(this, arguments);
    },

    /** 
     * Method: setCenter
     * As soon as a baseLayer has been loaded, we center and zoom
     *   ...and remove the handler.
     */
    setCenter: function(map) {
        // R�initialise le zoom avec l'�chele de la carte m�moris�e (si toutes les cartes n'ont pas les m�mes r�solutions)
        // Ce calcul est fait ici car la baselayer est d�finie
        if (this.map.baseLayer && this.params.defaut.scale) {
            var resolution = OpenLayers.Util.getResolutionFromScale (this.params.defaut.scale, this.map.baseLayer.units);
            this.zoom = this.map.getZoomForResolution (resolution, true);
        }
        OpenLayers.Control.ArgParser.prototype.setCenter.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Control.ArgParserCookies"
});
