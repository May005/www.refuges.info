<?php
/**********************************************************************************************
Permettre à n'importe qui d'indiquer qu'un commentaire à pas, peu, un peu, ou beaucoup d'intérêt, 
J'avais imaginé un système sophistiqué de scoring mais en fait c'est très peu utilisé, là ou
c'est utile, c'est que si un internaute trouve un commentaire inutile ça l'indique à un modérateur
**********************************************************************************************/
require_once ("fonctions_mode_emploi.php");
require_once ("fonctions_bdd.php");
require_once ("fonctions_commentaires.php");

$vue->description = $description;
$conditions= new stdClass;
$conditions->avec_infos_point=True;
$conditions->ids_commentaires=$controlleur->url_decoupee[2];
$commentaires=infos_commentaires($conditions);
if ($commentaires->erreur)
{
    $vue->type="page_introuvable";
    $vue->contenu=$commentaires->message;
            
}
else
{
    $commentaire=$commentaires[0];
    $vue->commentaire=$commentaire;
    $vue->commentaire->lien=lien_point_fast($commentaire,True);
    
    /**************************** l'action  ******************************/
    if ($_POST['valider']!="")
    {
        $vue->type="page_simple";
        // Si l'internaute est connecté au forum ou qu'il a saisi la lettre anti-robot
        if (isset($_SESSION['id_utilisateur']) or $_POST['anti_robot']=="f")
        {
            $commentaire->qualite_supposee+=$_POST['score'];
            if ($_POST['score']>1)
                $commentaire->demande_correction=1;
            modification_ajout_commentaire($commentaire);
            $vue->titre="Merci pour votre aide au classement";
        }
        else
            $vue->titre="Oups ? la lettre anti_robot saisie n'est pas la bonne";
        
        $vue->lien=$vue->commentaire->lien;
        $vue->contenu="Vous pouvez retourner sur : ";
        $vue->titre_lien="la fiche de $commentaire->nom";
    }
    else
    {
        $vue->lien_que_mettre=lien_mode_emploi("que_mettre");
        if (!isset($_SESSION['id_utilisateur']))
            $vue->test_anti_robot=True;
    }
}
?>
