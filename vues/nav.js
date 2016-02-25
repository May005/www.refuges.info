<?// Code Javascript de la page des cartes

// Ce fichier ne doit contenir que du code javascript destiné à être inclus dans la page
// $vue contient les données passées par le fichier PHP
// $config les données communes à tout WRI
?>

var map,
	wriPoi,
	wriMassif,
	massifLayer,
	poiOVER,
	poiLayer;

window.addEventListener('load', function() {
	<?php include ($config['racine_projet'].'vues/includes/cartes.js') ?>

	// Les massifs ou contours de massifs
	massifLayer = new L.GeoJSON.Ajax(
		'<?=$config['sous_dossier_installation']?>api/polygones', {
			argsGeoJSON: {
				type_polygon: 1,
<?if ($vue->mode_affichage == 'zone') {?>
		// Affiche tous les massifs d'une zone (en différentes couleurs)
				intersection: '<?=$vue->polygone->id_polygone?>',
<?}else{?>
				type_geom: 'polylines', // La surface à l'intérieur des massifs reste cliquable
<?}
if (!$vue->mode_affichage) {?>
				massif: '<?=$vue->polygone->id_polygone?>', // Affiche le contour d'un seul massif 
<?}?>
				time: <?=time()?> // Inhibe le cache
			},
			style: function(feature) {
				return {
					color: 'blue',
					weight: 2,
					fillOpacity: 0,
<?if ($vue->mode_affichage == 'zone') {?>
					title: feature.properties.nom,
					url: feature.properties.lien,
					color: 'black',
					weight: 1,
					fillColor: feature.properties.couleur,
					fillOpacity: 0.3,
<?}?>
					opacity: 0.6
				}
			}
		}
	);

	// Points via chemineur.fr
	var poiCHEM = new L.GeoJSON.Ajax.chem(),
		poiPRC = new L.GeoJSON.Ajax.chem({
			argsGeoJSON: {
				site: 'prc'
			},
			urlRootRef: 'http://www.pyrenees-refuges.com/fr/affiche.php?numenr='
		}),
		poiC2C = new L.GeoJSON.Ajax.chem({
			argsGeoJSON: {
				site: 'c2c'
			},
			urlRootRef: 'http://www.camptocamp.org/huts/'
		});

	wriPoi = new L.GeoJSON.Ajax.wriPoi({ // Les points choisis sur toute la carte
		argsGeoJSON: {
			type_points: '<?=$_COOKIE['type_points'] ? $_COOKIE['type_points'] : ''?>'
		},
	});
	wriMassif = new L.GeoJSON.Ajax.wriPoi({ // Seulement les points dans un massif
		urlGeoJSON: '<?=$config['sous_dossier_installation']?>api/massif',
		argsGeoJSON: {
			type_points: null,
			massif: '<?=$vue->polygone->id_polygone?>'
		},
		disabled: !wriPoi.options.argsGeoJSON
	});
	poiOVER = new L.GeoJSON.Ajax.OSMoverpass();
	poiLayer = <?if ( $vue->polygone->id_polygone ) {?>wriMassif<?}else{?>wriPoi<?}?>; // Couche active

	map = new L.Map('nav_bloc_carte', {
		layers: [
				baseLayers['<?=$config["carte_base"]?>'] || // Sinon le fond de carte par défaut
				baseLayers[Object.keys(baseLayers)[0]], // Sinon la première couche définie
			massifLayer
		]
	});

	map.setView([45.6, 6.7], 6);
	new L.Control.Permalink.Cookies({
		text: 'Permalien',
		layers: new L.Control.Layers(baseLayers).addTo(map) // Le controle de changement de couche de carte avec la liste des cartes dispo
	}).addTo(map);

<?if ( $vue->polygone->bbox ){?>
	var bboxs = [<?=$vue->polygone->bbox?>]; // BBox au format Openlayers [left, bottom, right, top] = [west, south, east, north]
	map.fitBounds([ // Bbox au format Leaflet
		[bboxs[1], bboxs[0]], // South West
		[bboxs[3], bboxs[2]]  // North East
	]);
<?}?>

	new L.Control.Scale().addTo(map);
	new L.Control.Coordinates().addTo(map);

	<?if ( $vue->mode_affichage != 'zone' ){?>
		new L.Control.Fullscreen().addTo(map);
		new L.Control.OSMGeocoder({
			position: 'topleft'
		}).addTo(map);
		new L.Control.Gps().addTo(map);
		var fl = L.Control.fileLayerLoad().addTo(map);
	<?}?>

	<?if ( !$vue->mode_affichage ){?>
		poiLayer.addTo(map);
		poiOVER.addTo(map);
	<?}?>

	<?if ( $vue->mode_affichage == 'edit' ){?>
		// Editeur et aide de l'éditeur
		var edit = new L.Control.Draw.Plus({
			draw: {
				polygon: true,
				polyline: true
			},
			edit: {
				remove: true
			},
			editType: 'MultiPolygon', // Force le format de sortie geoGson
		}).addTo(map);
		fl.loader.on ('data:loaded', function (args){
			this._map.fire('draw:created', { // Rend la trace éditable
				layer: args.layer
			});
		}, fl);
		
		massifLayer.addTo(edit.snapLayers); // Permet de "coller" aux tracés des autres massifs
	<?}?>
	maj_poi(); // Initialise la coche [de]cocher
});
/*************************************************************************************************************************************/
function switch_massif (combo) {
    if (combo.checked) {
        document.getElementById ('titrepage') .firstChild.nodeValue = "<?echo addslashes($vue->titre)?>"; 
		map.addLayer(massifLayer);
		map.removeLayer(poiLayer);
		map.addLayer(poiLayer = wriMassif);
    } else {
        document.getElementById ('titrepage') .firstChild.nodeValue = "Navigation sur les cartes"; 
		map.removeLayer(massifLayer);
		map.removeLayer(poiLayer);
		map.addLayer(poiLayer = wriPoi);
    }
}
/*************************************************************************************************************************************/
function maj_poi (c) {
<?php if (!$vue->mode_affichage == 'edit') {?>
    // Calcule l'argument d'extration filtre de points
    var poitypes = document.getElementsByName ('point_type[]'),
		check_types = document.getElementsByName ('check-types-input'),
		allchecked = true;

    type_points = '';
    for (var i=0; i < poitypes.length; i++) {
		if (c && check_types.length)
			poitypes[i].checked = check_types[0].checked;
        if (poitypes[i].checked)
            type_points += (type_points ? ',' : '') + poitypes[i].value;
		else
			allchecked = false;
	}
	check_types[0].checked = allchecked;
    // L'écrit dans un cookie pour se les rappeler au prochain affichage de cette page
    document.cookie = 'type_points=' + escape (type_points) + ';path=/';

	// On reparamètre les couches POI
	wriPoi.options.argsGeoJSON.type_points = 
	wriMassif.options.argsGeoJSON.type_points =
		type_points;
	poiLayer.options.disabled = !type_points;

	// Et on réaffiche la couche courante
	poiLayer.reload();
<?}?>
}
/*************************************************************************************************************************************/
function maj_autres_site(e,l) {
	if(e.checked)
		map.addLayer(l);
	else
		map.removeLayer(l);
}
