<?php 
/*******************************************************************************
Ecran d'accueil de la version mobile

Contient le code PHP de la page
Le code html est dans /vues/*.html
Le code javascript est dans /vues/*.js
Les variables sont passées dans l'objet $modele->...
*******************************************************************************/

require_once ('../modeles/config.php');

$modele = new stdClass;
$modele->titre = 'Carte de refuges, cabanes et abris de montagne | Version mobile';

// On affiche le tout
$modele->type = 'index';
include ("vues/_entete.html");
include ("vues/$modele->type.html");
include ("vues/_pied.html");
?>
