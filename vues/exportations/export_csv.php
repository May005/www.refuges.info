<?php
	header("Content-disposition: attachment; filename='$vue->nom_fichier_export.csv");
	header("Content-Type: text/csv; charset=$vue->content_type");
	header("Content-Transfer-Encoding: binary");
	header("Pragma: no-cache");
	header("Expires: 0");
?>
id_point;nom;type;massif;altitude;latitude;longitude;qualité GPS;nombre de place
<?if ($vue->pois) foreach ($vue->pois AS $type) foreach ($type AS $point) {?>
<?=$point->id_point?>;<?=$point->nom?>;<?=$point->nom_type?>;<?=$point->nom_massif?>;<?=$point->altitude?>;<?=$point->latitude?>;<?=$point->longitude?>;<?=$point->nom_precision_gps?>;<?=$point->places?>

<?}?>
