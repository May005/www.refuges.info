<?php 
/*******************************************************************************
Ecran d'accueil

Contient le code PHP de la page
Le code html est dans /vues/*.html
Le code javascript est dans /vues/*.js
Les variables sont passées dans l'objet $vue->...
*******************************************************************************/

require_once ("nouvelle.php");
require_once ("polygone.php");

$vue->titre = 'Carte et informations sur les refuges, cabanes et abris de montagne';
$vue->description='Base de donnee de refuges, abris, gites, sommets et divers points en montagne avec cartes satellite, descriptions et coordonnees GPS';

$vue->css           [] = $config['url_chemin_leaflet'].'leaflet.css?'.filemtime($config['chemin_leaflet'].'leaflet.css');
$vue->java_lib_foot [] = $config['url_chemin_leaflet'].'leaflet.js?' .filemtime($config['chemin_leaflet'].'leaflet.js');
$vue->fond_carte_par_defaut= $config['carte_base'];

$conditions_notre_zone = new stdClass;
$conditions_notre_zone->ids_polygones=$config['id_zone_accueil'];
$polygones=infos_polygones($conditions_notre_zone);
$vue->bbox=$polygones[0]->bbox;

// Nouvelles
$vue->commentaires = $commentaires;
$vue->stat = stat_site ();

// Préparation de la liste des photos récentes
$conditions = new stdclass();
$conditions->limite=5;
$conditions->avec_photo=True;
$conditions->avec_infos_point=True;
$commentaires_avec_photos_recentes=infos_commentaires($conditions);
// ce re-parcours du tableau à pour but de rajouter le lien et le nom formaté, on pourrait sans doute s'en passer en mettant $vue->photos_recentes=$commentaires_avec_photos_recentes mais il faudrait
// alors déporter ces deux actions dans la vue. Hésitation entre rangement et factorisation. sly 2015
foreach ($commentaires_avec_photos_recentes as $commentaire_avec_photo_recente)
{
    $commentaire_avec_photo_recente->lien=lien_point($commentaire_avec_photo_recente,true)."#C$commentaire_avec_photo_recente->id_commentaire";
    $commentaire_avec_photo_recente->nom=bbcode2html($commentaire_avec_photo_recente->nom);
    $vue->photos_recentes[]=$commentaire_avec_photo_recente;
}
$vue->contenu_accueil=wiki_page_html("contenu_accueil");

// Préparation de la liste des nouvelles générales
$conditions_commentaires_generaux = new stdClass;
$conditions_commentaires_generaux->ids_points=$config['numero_commentaires_generaux'];
$conditions_commentaires_generaux->limite=2;
$vue->nouvelles_generales=infos_commentaires($conditions_commentaires_generaux);

// FIXME: Préparation de la liste des nouveaux commentaires
// ici, on pourrait vraiment se passer de la fonction nouvelles et ainsi de pas dépendre d'un truc qui génère du HTML
$vue->nouveaux_commentaires=nouvelles(9,"commentaires");
$vue->nouveaux_commentaires = texte_nouvelles ($vue->nouveaux_commentaires); // On ajoute le texte
foreach ($vue->nouveaux_commentaires as $id => $nouvelle)
{
    $vue->nouveaux_commentaires[$id]['date_formatee']=date("d/m/y", $nouvelle['date']);
    $vue->nouveaux_commentaires[$id]['texte']=bbcode2html($nouvelle['texte']);
}

// Préparation de la liste des nouveaux points rentrés
$conditions_nouveaux_points = new stdClass;
$conditions_nouveaux_points->limite=3;
$conditions_nouveaux_points->avec_infos_massif=True;
$conditions_nouveaux_points->ordre="date_creation DESC";
$nouveaux_points=infos_points($conditions_nouveaux_points);
foreach ($nouveaux_points as $nouveau_point)
{
    $nouveau_point->lien=lien_point($nouveau_point,true);
    $nouveau_point->nom=mb_ucfirst(bbcode2html($nouveau_point->nom));
    $vue->nouveaux_points[]=$nouveau_point;
}
$vue->nouvelles_generales=wiki_page_html("nouvelles_generales");

?>
