ol2.12
======

Am�liorations apport�es � Openlayers 2.12

/*************************************************************************************************************************************/
RESTRICTIONS
IGN & SwissTopo ne fonctionnent pas sous Opera sous localhost (restriction de s�curit� de Opera). G�nant en debug, pas en prod

/*************************************************************************************************************************************/
Etape 1: Librairies incluses:
	OpenLayers-2.12.zip (img lib theme license.txt): http://openlayers.org/
	proj4js de proj4js-1.1.0.zip (lib)
	jsmin https://github.com/rgrove/jsmin-php pour la compression de la biblioth�que (respecte le nom des variables, ce qui n'est pas optimal mais semble n�c�ssaire � OL)

Etape 2: Livraison � refuges.info
	Patchs : Les patchs inclus sont document�s dans
		http://trac.osgeo.org/openlayers/ticket/2349 : Add label background color and border
		http://trac.osgeo.org/openlayers/ticket/2551 : Apply text symbolizer properties
		http://trac.osgeo.org/openlayers/ticket/2965 : Add halo's to vector labels
	Les lignes modifi�es commencent par
		//DC// Lignes supprim�es
		/*DC*/ Lignes supprim�es
		//DC   Commentaire

	Fichiers perso:
		proxy.php // Ecrit en PHP parceque je n'ai pas de PERL sur mon PC
		refuges-info-sld.xml // �Dominique.Cavailhez

Etape 3: Evolutions

/*************************************************************************************************************************************/
ARCHITECTURE
La totalit� du code est �crit en Javascript et s'ex�cute dans l'explorateur (pas de PHP)
On �t� test�s : IE6, 7, 8 & 9 (sous W7), FF, Chrome, Opera (sous XP), Safari
pas de test sous Linux & MAC

Tout le code concernant la gestion des cartes est situ� dans le r�pertoire http://refuges.info/olX (X d�pendant le l'�volution du logiciel
Il est inclu par le seul appel � <script type="text/javascript" src="http://refuges.info/olX/OpenLayers.js"></script>
	La librairie est enti�rement contenue dans la classe Openlayers et ses sous classes
	Chaque classe Openlayers.xxx.yyy.zzz.js est d�clar�e dans le fichier lib/Openlayers/xxx/yyy/zzz.js
	
Cette biblioth�que est compress�e par jsmin et GZIPp� par l'APPACHE du serveur
	G�n�ration de la bibioth�que en 1 seul fichier ninifi�
	Appeler http://refuges.info/olX/build/index.php
	Ceci cr�e http://refuges.info/olX/OpenLayers.js
	Ceci cr�e http://refuges.info/olX/lib/OpenLayers.js
	Et un fichier de trace de g�n�ration http://refuges.info/olX/build/build.log.html
		Ce fichier liste les modifications par rapport � la livraison OL d'origine

Ce builder inclue les classes correspondantes aux objets Openlayers et proj4js utilis�es dans ../vues/*.js, sinon dans TEST/index.php

Pour debugger, il faut inclure <script type="text/javascript" src="http://refuges.info/olX/lib/OpenLayers.js"></script>
	Cette bibioth�que inclue les fichiers unitaires et non compress�s de lib/... 
	Elle est beaucoup plus lente mais permet de debugger dans les fichiers d'origine plus lisibles

Les param�tres d'affichage de la carte m�moris�s dans le cookie "Olparams" de syntaxe proche du permalink
	
/*************************************************************************************************************************************/
NOTES:
Safari sous XP : Windows XPS Viewer Essentials Pack
Opera sous localhost : n'envoie pas de referer

/*************************************************************************************************************************************/
TODO WRI

WRI/NAV TODO filtres types de points sur C2C / ch
IE8 : mauvais cadrage de � exporter la vue � ?? (sur PC ALU)
NAV.php faire varier les champs est ouest, ... de "exporter la vue" en fonction de la navigation dans la carte
taille police massifs sous IE

/*************************************************************************************************************************************/
TODO

NON IMPLEMENTE: http://trac.osgeo.org/openlayers/ticket/1704 : Malformed URI sequence in Firefox when using special characters in url
http://webglearth.org/ OL 3D
OpenLayers.ProxyHost = "proxy.cgi?url=";
GMLSLD Strat�gy Fixed param�trable
GMLSLD this.redraw (); // TODO : �viter de demander 2 fois les couches au serveur

 ??? clarifier defaut/params / programme dans le code
V�rifier entres cre / cookies from page
Mettre include API GG dans la classe
Emettre erreur sur SLD vide ou URL KO

Italie : remettre un bout de carte OSM pour zoom moyens /// Italie couche haute / http://www.igmi.org/ware/   view-source:http://www.igmi.org/ware/map.html   WMS->Grid   MapServer->Grid
Italie : passer en m plut�t que degr�s

http://openpistemap.org/
skitour = OLcoucheWFS(map, "Skitour Refuges", "skitour_refuges", sldFile, "HebergementsJeroen", true);


BUG
Workspace gpx: ne fonctionne pas (lecture / ecriture) sous FF
Tester visu GPX avec le patch replace
S�parer les cut des delete sommet

A VOIR
http://trac.osgeo.org/openlayers/attachment/ticket/1882/DeleteFeature.js
http://trac.osgeo.org/openlayers/ticket/1249 Baselayers multiprojections
http://lists.osgeo.org/pipermail/openlayers-users/2011-July/021502.html
