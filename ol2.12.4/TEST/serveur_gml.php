<?php // 16/09/12 Dominique : Cr�ation
// Syntaxe: serveur_gml.php?trace=test

$filename = 'serveur_gml_data/'.$_GET['trace'].'.gpx';

// Si on a un fichier remont�, on le m�morise
if ($data = file_get_contents("php://input")) // R�cup�ration du flux en m�thode PUT
	file_put_contents ($filename, str_replace (">", ">\n", str_replace ("gpx:", "", $data)));

// Si on a une trace sur le serveur, on l'envoie � l'�diteur 
header('Content-type: application/gpx+xml');
header('Content-Disposition: attachment; filename="'.$_GET['trace'].'.gpx"');
if (file_exists ($filename))
	print (file_get_contents ($filename));
?>