<?php
/**************************************************
 *              ROUTEUR de l'API
 * Ce fichier appelle juste le bon controlleur.
 * La vue et le modèle sont appellés par le controlleur.
 * cf. : http://bpesquet.developpez.com/tutoriels/php/evoluer-architecture-mvc/images/3.png
 *
 * Changelog :
 *   * 18/10/2014 - Léo - Version intiale :
 *          découpage URL, redirection sur le bon
 *          controleur.
 * 
**************************************************/


// Cible sera le contenu de l'URL entre /api/ et ?argument=
$cible = str_replace('/api/','',$_SERVER['REQUEST_URI']); // On enlève le /api/ qui traine
$cible = str_replace($_SERVER['QUERY_STRING'],'',$cible); // On enlève ce qu'il y a après le ?
$cible = str_replace('?','',$cible); // On enlève le ? (implique pas de ? dans les noms de fichiers)

switch ($cible) {
    case 'point':
        
        break;
    default:
        Header('Location:doc/');
        //echo $cible;
        break;
}

?>