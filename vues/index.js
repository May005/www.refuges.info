<?// Script lié à la page d'acceuil

// Ce fichier ne doit contenir que du code javascript destiné à être inclus dans la page
// $modele contient les données passées par le fichier PHP
// $config les données communes à tout WRI

// 17/10/11 Dominique : Création
// 23/10/11 Dominique : Retour ici du code spécifique à la page qui avait été mis dans la bibliothèque
// 15/04/11 Dominique : Passage en OL2.11
// 08/05/12 Dominique : Retour en templates simples
// 12/07/12 Dominique : Enrichissement avec les news
// 15/02/13 jmb : gestion des zones
?>

// Crée la carte dés que la page est chargée
window.onload = function () {
	var map = new OpenLayers.Map ('accueil', {
		displayProjection: new OpenLayers.Projection ('EPSG:4326'), // Données en °
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.Attribution()
		],
		layers: [
			new OpenLayers.Layer.Google ('Google', {type: google.maps.MapTypeId.TERRAIN})
		]
	});
	
	// Positionne la carte sur la zone donnée par le .PHP
	var bornes = new OpenLayers.Bounds ( <?=$modele->bbox?> ) 
				.transform (map.displayProjection, map.getProjectionObject());

	map.setCenter (
		bornes.getCenterLonLat (),
		map.getZoomForExtent (bornes)
	);

	// Ajoute les couches vectorielles avec controle
	map.addLayers ([
		new OpenLayers.Layer.GMLSLD ('Massifs', {	
			urlGML: '/exportations/massifs-gml.php',
			projection: 'EPSG:4326', // Le GML est fourni en degminsec
			urlSLD: OpenLayers._getScriptLocation() + 'refuges-info-sld.xml',
			styleName: 'Massifs'
		})
	]);
}
