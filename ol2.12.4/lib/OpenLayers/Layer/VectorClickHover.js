/*DCM++ � Dominique Cavailhez 2012.
 * Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of the license. */

/**
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Control/SelectFeature.js
 * @requires OpenLayers/Popup/FramedCloud.js
 */

/**
 * Class: OpenLayers.Layer.VectorClickHover
 * Create a vector layer listened by the 2 listeners click & hover
 * These listeners needs to be implemented only once, and all related layers attacher to it
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Vector>
 */

 OpenLayers.Layer.VectorClickHover = OpenLayers.Class (OpenLayers.Layer.Vector, {

    popup: null, // Popup remanent (1 par couche)

 // Quand la couche est ajout�e � la carte, ajoute �galement les �couteurs de click & hover
    setMap: function (map) {
        OpenLayers.Layer.Vector.prototype.setMap.apply (this, arguments);

        // Ajoute l'�couteur de survol
        if (!map.hoverListener) { // Un seul �couteur par carte
            map.hoverListener = new OpenLayers.Control.SelectFeature (
                [this], {
                    hover: true,
                    highlightOnly: true, // Permet la coexistence des �couteurs hover & click http://trac.osgeo.org/openlayers/ticket/1596  OpenLayers-2.10/examples/highlight-feature.html
                    eventListeners: {
                        featurehighlighted: function (e) {
                            if (e.feature.attributes.url)
                                e.feature.layer.map.div.style.cursor = 'pointer';
                            e.feature.layer.map.clickListener.unselectAll (); // Rend service aux �couteurs de clicks
                        },
                        featureunhighlighted: function (e) {
                            e.feature.layer.map.div.style.cursor = 'default';
                        }
                    }
                }
            )
            map.addControl (map.hoverListener);
            map.hoverListener .activate();
        } else { // On y attache les autres couches
            map.hoverListener.layers.push (this); // Ajoute celle ci � la liste
            map.hoverListener.setLayer (map.hoverListener.layers); // R�initialise la liste
        }

        // Ajoute l'�couteur de click (obligatoirement apr�s celui de survol)
        if (!map.clickListener) { // Un seul �couteur par carte
            map.clickListener = new OpenLayers.Control.SelectFeature (
                [this], {
                    clickout: true,
                    onUnselect: function (e) {
                        if (e.layer.popup) 
                            e.layer.popup.destroy ();
                        e.layer.popup = null;
                    },
                    onSelect: function (e) {
                        // utilise l'attribut du feature GML: <html>http://...</html>
                        if (e.attributes.html) {
                            e.layer.popup = new OpenLayers.Popup.FramedCloud ('',
                                e.geometry.getBounds().getCenterLonLat(),
                                null,
                                e.attributes.html.replace (/\[/g,'<').replace (/\]/g,'>')
                            );
                            e.layer.map.addPopup (e.layer.popup);
                        }
                        // utilise l'attribut du feature GML: <url>http://...</url>
                        if (e.attributes.url) {
                            if (e.evt.shiftKey || e.evt.ctrlKey) // Shift + Click lance le lien dans une nouvelle fen�tre
                                window.open (e.attributes.url);
                            else
                                document.location.href = e.attributes.url;
                        }
                    }
                }
            );
            map.addControl (map.clickListener);
            map.clickListener .activate();
        } else { // On y attache les autres couches
            map.clickListener.layers.push (this); // Ajoute celle ci � la liste
            map.clickListener.setLayer (map.clickListener.layers); // R�initialise la liste
        }
    },

    CLASS_NAME: "OpenLayers.Layer.VectorClickHover"
});
