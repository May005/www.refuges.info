<?php //DCM++ Syntaxe proxy.php?bbox=7.18,45.57,14.13,47.83&url=serveur_kml&....
//**********************************************************************************************
//* Nom du module:         | proxy.php                                                         *
//* Date :                 | 27/10/2010                                                        *
//* Cr�ateur :             | Dominique                                                         *
//* R�le du module :       | Interroge un serveur distant et renvoie les donn�es               *
//*                        | Permer d'acc�der � des flux d'autres serveurs (KLM, ...)          *
//*                        | Ce proxy est rendu n�c�ssaire par le fait que la requette         *
//*                        | Httprequest utilis�e pour rapatrier les cartes ne peut acc�der    *
//*                        | pour des raisons de s�curit� au serveur ayant affich� la page     *
//*                        | principale.                                                       *
//*------------------------|-------------------------------------------------------------------*
//* Modifications(date Nom)| Elements modifi�s, ajout�s ou supprim�s                           *
//*------------------------|-------------------------------------------------------------------*
//**********************************************************************************************

/* This is a blind proxy that we use to get around browser
restrictions that prevent the Javascript from loading pages not on the
same server as the Javascript.  This has several problems: it's less
efficient, it might break some sites, and it's a security risk because
people can use this proxy to browse the web and possibly do bad stuff
with it.  It only loads pages via http, but it can load any
content type. It supports only GET requests. */

/******************************************************************************/
// Traitement des arguments
//parse_str ($_SERVER ['QUERY_STRING'], $args); // On isole les arguments
parse_str (str_replace ('?', '&', $_SERVER ['QUERY_STRING']), $args); // On isole les arguments
$url = $args ['url']; // On analyse l'arg url
unset ($args ['url']); // On le retire de la liste des arguments
$url .= '?args';
if (count ($args))
	foreach ($args AS $k => $v)
		$url .= '&' .$k .'=' .$v; // On ajoute les arguments restants � l'ulr finale

/******************************************************************************/
// S�curit�: on autorise le rebond que vers quelques sites identifi�s pour �viter � n'importe qui de faire n'importe quoi
$purl = parse_url ($url); // On analyse l'url
switch ($purl ['host']) // Liste des serveurs autoris�s
{
//	case 'labs.metacarta.com':
	case 'localhost':
	case 'refuges.info':
	case 'www.refuges.info':
	case 'chemineur.fr':
	case 'wmts.geo.admin.ch':
		// C'est bon. On va chercher le contenu et on l'affiche
		
/******************************************************************************/
		// Lit le contenu d'une URL distante
		$ch = curl_init();  // Initialiser cURL.
			curl_setopt ($ch, CURLOPT_URL, $url);  // Indiquer quel URL r�cup�rer
			curl_setopt ($ch, CURLOPT_HEADER, 0);  // Ne pas inclure l'header dans la r�ponse.
			ob_start ();  // Commencer � 'cache' l'output.
				curl_exec ($ch);  // Ex�cuter la requ�te.
				$cache = ob_get_contents ();  // Sauvegarder la 'cache' dans la variable $cache.
			ob_end_clean();  // Vider le buffer.
		curl_close ($ch);  // Fermer cURL.
		
/******************************************************************************/
// Trace
if(0) {
		$f = fopen ('proxy.log', 'a');
//		fwrite ($f, var_export ($_SERVER, TRUE));
		fwrite ($f, str_replace ("<", "\n<", file_get_contents("php://input"))."\n\n");
		fclose ($f);
}
/******************************************************************************/
		// Il faut forcer le charset dans le header car Openlayers ne va lire le type qu'ici et ignore les balise META
		// LE correctif qui tue propos� par SLY apr�s une lute m�morable avec les charsets
		$charset = mb_detect_encoding ($cache, "UTF-8,ISO-8859-1,ISO-8859-5,ISO-8859-6,ISO-8859-7,ASCII,EUC-JP,JIS,SJIS,SHIFT_JIS,ISO-2022-JP,EUC-KR,ISO-2022-KR", true);
//		header("Content-Type:text/html; charset=$charset");
		header("Content-Type:text/html; charset=ISO-8859-1");

		// Envoie le r�sultat
		print ($cache);
	
/******************************************************************************/
		break;
	default:
		print ('Serveur ' .$purl ['host'] .' non autoris�');
}
?>
