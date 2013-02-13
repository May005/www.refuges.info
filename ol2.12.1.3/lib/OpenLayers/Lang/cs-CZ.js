/* Translators (2009 onwards):
 *  - Mormegil
 */

/**
 * @requires OpenLayers/Lang.js
 */

/**
 * Namespace: OpenLayers.Lang["cs-CZ"]
 * Dictionary for Äesky.  Keys for entries are used in calls to
 *     <OpenLayers.Lang.translate>.  Entry bodies are normal strings or
 *     strings formatted for use with <OpenLayers.String.format> calls.
 */
OpenLayers.Lang["cs-CZ"] = OpenLayers.Util.applyDefaults({

    'unhandledRequest': "NezpracovanÃ¡ nÃ¡vratovÃ¡ hodnota ${statusText}",

    'Permalink': "TrvalÃ½ odkaz",

    'Overlays': "PÅekryvnÃ© vrstvy",

    'Base Layer': "PodkladovÃ© vrstvy",

    'noFID': "Nelze aktualizovat prvek, pro kterÃ½ neexistuje FID.",

    'browserNotSupported': "VÃ¡Å¡ prohlÃ­Å¾eÄ nepodporuje vykreslovÃ¡nÃ­ vektorÅ¯. MomentÃ¡lnÄ podporovanÃ© nÃ¡stroje jsou::\n${renderers}",

    'minZoomLevelError': "Vlastnost minZoomLevel by se mÄla pouÅ¾Ã­vat pouze s potomky FixedZoomLevels vrstvami. To znamenÃ¡, Å¾e vrstva wfs kontroluje, zda-li minZoomLevel nenÃ­ zbytek z minulosti.Nelze to ovÅ¡em vyjmout bez moÅ¾nosti, Å¾e bychom rozbili aplikace postavenÃ© na OL, kterÃ© by na tom mohly zÃ¡viset. Proto tuto vlastnost nedoporuÄujeme pouÅ¾Ã­vat --  kontrola minZoomLevel bude odstranÄna ve verzi 3.0. PouÅ¾ijte prosÃ­m radÄji nastavenÃ­ min/max podle pÅÃ­kaldu popsanÃ©ho na: http://trac.openlayers.org/wiki/SettingZoomLevels",

    'commitSuccess': "WFS Transaction: ÃSPÄCH ${response}",

    'commitFailed': "WFS Transaction: CHYBA ${response}",

    'googleWarning': "NepodaÅilo se sprÃ¡vnÄ naÄÃ­st vrstvu Google.\x3cbr\x3e\x3cbr\x3eAbyste se zbavili tÃ©to zprÃ¡vy, zvolte jinou zÃ¡kladnÃ­ vrstvu v pÅepÃ­naÄi vrstev.\x3cbr\x3e\x3cbr\x3eTo se vÄtÅ¡inou stÃ¡vÃ¡, pokud nebyl naÄten skript, nebo neobsahuje sprÃ¡vnÃ½ klÃ­Ä pro API pro tuto strÃ¡nku.\x3cbr\x3e\x3cbr\x3eVÃ½vojÃ¡Åi: Pro pomoc, aby tohle fungovalo , \x3ca href=\'http://trac.openlayers.org/wiki/Google\' target=\'_blank\'\x3ekliknÄte sem\x3c/a\x3e",

    'getLayerWarning': "The ${layerType} Layer was unable to load correctly.\x3cbr\x3e\x3cbr\x3eTo get rid of this message, select a new BaseLayer in the layer switcher in the upper-right corner.\x3cbr\x3e\x3cbr\x3eMost likely, this is because the ${layerLib} library script was either not correctly included.\x3cbr\x3e\x3cbr\x3eDevelopers: For help getting this working correctly, \x3ca href=\'http://trac.openlayers.org/wiki/${layerLib}\' target=\'_blank\'\x3eclick here\x3c/a\x3e",

    'Scale = 1 : ${scaleDenom}': "MÄÅÃ­tko = 1 : ${scaleDenom}",

    'reprojectDeprecated': "PouÅ¾il jste volbu \'reproject\' ve vrstvÄ ${layerName}. Tato volba nenÃ­ doporuÄenÃ¡: byla zde proto, aby bylo moÅ¾no zobrazovat data z okomerÄnÃ­ch serverÅ¯, ale tato funkce je nynÃ­ zajiÅ¡tÄna pomocÃ­ podpory Spherical Mercator. VÃ­ce informacÃ­ naleznete na http://trac.openlayers.org/wiki/SphericalMercator.",

    'methodDeprecated': "Tato metoda je zavrÅ¾enÃ¡ a bude ve verzi 3.0 odstranÄna. ProsÃ­m, pouÅ¾ijte radÄji ${newMethod}."

});
