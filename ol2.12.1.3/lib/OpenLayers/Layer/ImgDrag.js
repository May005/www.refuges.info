/*DCM++ © Dominique Cavailhez 2012.
 * Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of the license. */

/**
 * @requires OpenLayers/Layer/VectorClickHover.js
 * @requires OpenLayers/Layer/ImgPosition.js
 * @requires OpenLayers/Layer/Img.js
 */

/**
 * Class: OpenLayers.Layer.ImgDrag
 * Crée un layer vector contenant une image déplaçable qui met à jour des champs lon/lat avec sélection du type de coordonnée
 *
 * Inherits from:
 *  - <OpenLayers.Layer.ImgPosition>
 */

OpenLayers.Layer.ImgDrag = OpenLayers.Class (OpenLayers.Layer.ImgPosition, OpenLayers.Layer.VectorClickHover, {
	
	// Change la position affichée
 	setValues: function (ll) { // ll en degrés décimaux
		this.position = ll;
		this.setPosition (ll); // La carte
		this.drawSelect (); // Le sélecteur
		this.drawValues (); // Les champs
	},

	// Quand la couche est ajoutée à la carte, ajoute également l'écouteur de drag
	setMap: function  (map) {
        OpenLayers.Layer.ImgPosition.prototype.setMap.apply (this, arguments);
		
		// Lie la couche à'écouteur de click s'il a été défini avant (sinon, celui ci n'est plus activé)
		if (map.clickListener) {
			map.clickListener.layers.push (this);
			map.clickListener.setLayer (map.clickListener.layers);
		}
		
		// Crée l'écouteur de déplacement
		var ctrl = new OpenLayers.Control.DragFeature (this, {
			onDrag: function (feature) { // On a déplacé l'image
				var ll = feature.geometry.getBounds().getCenterLonLat()
				feature.layer.setValues (ll.clone().transform (
					feature.layer.map.getProjectionObject (), // Transforme les coordonnées de travail (celles de la première carte)
					feature.layer.map.displayProjection       // En celles courantes sur le site
				));
			}
		});
		map.addControl (ctrl);
		ctrl.activate ();
		
		// Initialise les écouteurs sur l'entrée de données dans les champs de saisie
		for (l in this.idll)
			if (this.el.projected[l]) {
				this.el.projected[l].owner = this; // Pour retrouver le contexte lors du callback
				this.el.projected[l].onchange = function (e) {
					var unformat = this.owner.find (this.owner.unformat, this.owner.projectionType);
					var ll = new OpenLayers.LonLat (
						unformat (this.owner.el.projected.lon.value),
						unformat (this.owner.el.projected.lat.value)
					);
					if (Proj4js.defs [this.owner.projectionType])
						ll.transform ( // On renvoie les nouvelles coordonnées en lonlat décimal
							new OpenLayers.Projection (this.owner.projectionType),
							new OpenLayers.Projection ('EPSG:4326')
						);
					this.owner.setValues (ll);
				}
			}
	},
	
	//-------------------------------------------------------------
	// Fonctions à appeler de l'extérieur
	
	// Centre l'image au centre de la partie visualisée de la carte
	centre: function  () {
		var ll = this.map.getCenter ().transform (
			this.map.getProjectionObject (), // Transforme les coordonnées de travail (celles de la première carte)
			this.map.displayProjection // En celles courantes sur le site
		);
		this.setPosition (ll); // De l'image
		this.setValues   (ll); // Des champs d'édition 
	},
	
	// Efface la position
 	efface: function () {
		this.el.projected.lon.value = '';
		this.el.projected.lat.value = '';
	},

    CLASS_NAME: "OpenLayers.Layer.ImgDrag"
});
