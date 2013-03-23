/*DCM++ � Dominique Cavailhez 2012.
 * Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/VectorClickHover.js
 * @requires OpenLayers/Layer/ImgPosition.js
 * @requires OpenLayers/Control/Dragfeature.js
 * @requires OpenLayers/BaseTypes/LonLat.js
 * @requires OpenLayers/Projection.js
 * @requires ../proj4js-1.1.0/lib/proj4js-combined.js
 * @requires ../proj4js-1.1.0/lib/defs/EPSG23030.js
 */

/**
 * Class: OpenLayers.Layer.ImgDrag
 * Cr�e un layer vector contenant une image d�pla�able qui met � jour des champs lon/lat avec s�lection du type de coordonn�e
 *
 * Inherits from:
 *  - <OpenLayers.Layer.ImgPosition>
 */

OpenLayers.Layer.ImgDrag = OpenLayers.Class (OpenLayers.Layer.ImgPosition, OpenLayers.Layer.VectorClickHover, {
	
	// Change la position affich�e
 	setValues: function (ll) { // ll en degr�s d�cimaux
		this.position = ll;
		this.setPosition (ll); // La carte
		this.drawSelect (); // Le s�lecteur
		this.drawValues (); // Les champs
	},

	// Quand la couche est ajout�e � la carte, ajoute �galement l'�couteur de drag
	setMap: function  (map) {
        OpenLayers.Layer.ImgPosition.prototype.setMap.apply (this, arguments);
		
		// Lie la couche �'�couteur de click s'il a �t� d�fini avant (sinon, celui ci n'est plus activ�)
		if (map.clickListener) {
			map.clickListener.layers.push (this);
			map.clickListener.setLayer (map.clickListener.layers);
		}
		
		// Cr�e l'�couteur de d�placement
		var ctrl = new OpenLayers.Control.DragFeature (this, {
			onDrag: function (feature) { // On a d�plac� l'image
				var ll = feature.geometry.getBounds().getCenterLonLat()
				feature.layer.setValues (ll.clone().transform (
					feature.layer.map.getProjectionObject (), // Transforme les coordonn�es de travail (celles de la premi�re carte)
					feature.layer.map.displayProjection       // En celles courantes sur le site
				));
			}
		});
		map.addControl (ctrl);
		ctrl.activate ();
		
		// Initialise les �couteurs sur l'entr�e de donn�es dans les champs de saisie
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
						ll.transform ( // On renvoie les nouvelles coordonn�es en lonlat d�cimal
							new OpenLayers.Projection (this.owner.projectionType),
							new OpenLayers.Projection ('EPSG:4326')
						);
					this.owner.setValues (ll);
					this.owner.recentre (); // Recentre la carte sur la nouvelle position
				}
			}
	},
	
	//-------------------------------------------------------------
	// Fonctions � appeler de l'ext�rieur
	
	// Centre l'image au centre de la partie visualis�e de la carte
	centre: function  () {
		var ll = this.map.getCenter ().transform (
			this.map.getProjectionObject (), // Transforme les coordonn�es de travail (celles de la premi�re carte)
			this.map.displayProjection // En celles courantes sur le site
		);
		this.setPosition (ll); // De l'image
		this.setValues   (ll); // Des champs d'�dition 
	},
	
	// Centre la partie visualis�e de la carte sur l'image
	recentre: function  () {
		this.map.setCenter (this.getPosition ().transform (
			this.map.displayProjection,
			this.map.getProjectionObject ()
		));
	},
	
	// Efface la position
 	efface: function () {
		this.el.projected.lon.value = '';
		this.el.projected.lat.value = '';
	},

    CLASS_NAME: "OpenLayers.Layer.ImgDrag"
});
