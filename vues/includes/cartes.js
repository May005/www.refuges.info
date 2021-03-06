<?php
/*
 * Copyright (c) 2016 Dominique Cavailhez
 * https://github.com/Dominique92/Leaflet.GeoJSON.Ajax
 *
 * Couches geoJson pour www.refuges.info
 */
?>

<?if (strstr('nav|point',$vue->type)) {?>
var baseLayers = {
	'Refuges.info':new L.TileLayer.OSM.MRI(),
	'OSM fr':      new L.TileLayer.OSM.FR(),
	'Outdoors':    new L.TileLayer.OSM.Outdoors(),
	'IGN':         new L.TileLayer.IGN({k: '<?=$config['ign_key']?>', l:'GEOGRAPHICALGRIDSYSTEMS.MAPS'}),
	'IGN Express': new L.TileLayer.IGN({k: '<?=$config['ign_key']?>', l:'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.CLASSIQUE'}),
	'SwissTopo':   new L.TileLayer.SwissTopo({l:'ch.swisstopo.pixelkarte-farbe'}),
	'Autriche':    new L.TileLayer.Kompass({l:'Touristik'}),
	'Espagne':     new L.TileLayer.WMS.IDEE(),
	'Angleterre':  new L.TileLayer.OSOpenSpace('<?=$config['os_key']?>', {}),
	'Photo Bing':  new L.BingLayer('<?=$config['bing_key']?>', {type:'Aerial'}),
	'Photo IGN':   new L.TileLayer.IGN({k: '<?=$config['ign_key']?>', l:'ORTHOIMAGERY.ORTHOPHOTOS'})
};
<?}?>

// Points d'interêt refuges.info
L.GeoJSON.Ajax.wriPoi = L.GeoJSON.Ajax.extend({
	options: {
		urlGeoJSON: '<?=$config['sous_dossier_installation']?>api/bbox',
		argsGeoJSON: {
			type_points: 'all'
		},
		bbox: true,
		idAjaxStatus: 'ajax-poi-status', // HTML id element owning the loading status display
		style: function(feature) {
			var referers = window.location.href.split('/'), // Use the same protocol than the referer.
				url_point = referers[0]+'//'+referers[2]+'/point/'+feature.properties.id,
				prop = [];
			if (feature.properties.coord.alt)
				prop.push(feature.properties.coord.alt + 'm');
			if (feature.properties.places.valeur)
				prop.push(feature.properties.places.valeur + '<img src="' + '<?=$config['sous_dossier_installation']?>images/lit.png"/>');
			this.options.disabled = !this.options.argsGeoJSON.type_points;
			return {
				url: url_point,
				iconUrl: '<?=$config['sous_dossier_installation']?>images/icones/' + feature.properties.type.icone + '.png',
				iconAnchor: [8, 8],
				popup: '<a href="' + url_point+ '">' + feature.properties.nom + '</a>' +
					(prop.length ? '<div style=text-align:center>' + prop.join(' ') + '</div>' : ''),
				popupClass: 'carte-point-etiquette',
				remanent: true,
				degroup: 12 // Spread the icons when the cursor hovers on a busy area.
			};
		}
	}
});

// Points d'interêt via chemineur.fr
<?if (strstr('nav',$vue->type)) {?>
L.GeoJSON.Ajax.chem = L.GeoJSON.Ajax.extend({
	options: {
		urlGeoJSON: 'http://v2.chemineur.fr/prod/chem/json.php',
		urlRootRef: 'http://chemineur.fr/point/',
		bbox: true,
		idAjaxStatus: 'ajax-poiCHEM-status',
		style: function(feature) {
			return {
				popup: feature.properties.nom + ' <a href="' + this.options.urlRootRef + feature.properties.id + '" target="_blank">&copy;</a>',
				iconUrl: 'http://v2.chemineur.fr/prod/chemtype/' + feature.properties.type.icone + '.png',
				iconAnchor: [8, 8],
				popupClass: 'carte-site-etiquette',
				remanent: true,
				degroup: 12
			};
		}
	}
});
<?}?>

// Points d'interêt OSM overpass
<?if (strstr('nav|point',$vue->type)) {?>
L.GeoJSON.Ajax.OSM.services = L.GeoJSON.Ajax.OSM.extend({
	options: {
		urlGeoJSON: '<?=$config['overpass_api']?>',
		maxLatAperture: 0.5, // Largeur de la carte (en degrés latitude) en dessous de laquelle on recherche les points
		timeout: 5, // En secondes, du serveur à partir duquel il abandonne la recherche et affiche la loupe rouge
		idAjaxStatus: 'ajax-osm-status', // HTML id element owning the loading status display

		// Traduction du nom des icônes (en minuscule !)
		// Les clés du tableau ci dessous sont les <VALEUR> retournées par overpass dans la structure .tags = {"xxx": <VALEUR>}
		// Les valeurs du tableau ci dessous sont les <NOM> des icones dans //WRI/images/icones/<NOM>.png
		// hotel & parking sont implicites (traduits par eux même par défaut parcequepas dans le tableau)
		icons: {
			camp_site: 'camping',
			guest_house: 'hotel',
			chalet: 'hotel',
			hostel: 'hotel',
			supermarket: 'ravitaillement',
			convenience: 'ravitaillement'
		},

		// Traduction du texte des étiquettes (en minuscule !)
		// Cette traduction est effectuée à la fin de la constitution du texte de l'étiquette et traduit aussi bien les infos overpass que les noms d'icônes que les textes ajoutés
		language: {
			hotel: 'hôtel',
			guest_house: 'chambre d\'hôte',
			chalet: 'gîte rural',
			hostel: 'auberge de jeunesse',
			camp_site: 'camping',
			convenience: 'alimentation',
			supermarket: 'supermarché',
			bus_stop: 'arrêt de bus'
		},

		// Formatage de l'étiquette affichée au survol
		label: function(data) { // Entrée: les données retournées par Overpass (corrigées pour certaines)
			return { // Sortie: les lignes à écrire dans l'étiquette du point
				name: '<b>' + data.tags.name + '</b>',
				description: [
					data.tag,
					'*'.repeat(data.tags.stars),
					data.tags.rooms ? data.tags.rooms + ' chambres' : '',
					data.tags.place ? data.tags.place + ' places' : '',
					data.tags.capacity ? data.tags.capacity + ' places' : '',
					'<a href="http://www.openstreetmap.org/' + (data.center ? 'way' : 'node') + '/' + data.id + '" target="_blank">&copy;</a>',
                                        data.tags.description ? '<br>' + data.tags.description : ''
				],
				altitude: data.tags.ele + ' m',
				phone: '<a href="tel:' + data.tags.phone.replace(/[^0-9\+]+/ig, '') + '">' + data.tags.phone + '</a>',
				email: '<a href="mailto:' + data.tags.email + '">' + data.tags.email + '</a>',
				address: [
					data.tags['addr:housenumber'],
					data.tags['addr:street'],
					data.tags['addr:postcode'],
					data.tags['addr:city']
				],
				website: '<a href="' + data.tags.website + '" target="_blank">' + data.tags.website + '</a>'
			};
			// Les tableaux seront concaténés
			// Les lignes correspondantes aux données inexistantes seront ignorées
		},

		// Style d'affichage des icônes
		style: function(feature) {
			return {
				iconUrl: '<?=$config['sous_dossier_installation']?>images/icones/' + feature.properties.icon_name + '.png',
				iconAnchor: [8, 8],
				popupClass: 'carte-service-etiquette',
				remanent: true,
				degroup: 12
			};
		}
	}
});
<?}?>
