// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

//main document ready function
$( document ).ready(function() {

	'use strict';

	/* create map */
	var map = L.map('mapDiv').setView([37.77, -122.45], 12);
	var layer = L.esri.basemapLayer('NationalGeographic').addTo(map);
	var layerLabels;

	$('#mapDiv').height($('body').height());
	map.invalidateSize();
	/* create map */

	/* basemap controller */
	function setBasemap(basemap) {
	    if (layer) {
	      map.removeLayer(layer);
	    }
	    layer = L.esri.basemapLayer(basemap);
	    map.addLayer(layer);
	    if (layerLabels) {
	      map.removeLayer(layerLabels);
	    }

	    if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {

	      layerLabels = L.esri.basemapLayer(basemap + 'Labels');
	      map.addLayer(layerLabels);
	    }
	}

	$('.basemapBtn').on('click',function() {
	  	var baseMap = this.id.replace('btn','');

	  	// https://github.com/Esri/esri-leaflet/issues/504 submitted issue that esri-leaflet basemaps dont match esri jsapi

	  	switch (baseMap) {
		    case 'Streets': baseMap = 'Streets'; break;
		    case 'Satellite': baseMap = 'Imagery'; break;
		    case 'Hybrid': baseMap = 'n/a'; break;
		    case 'Topo': baseMap = 'n/a'; break;
		    case 'Terrain': baseMap = 'ShadedRelief'; break;
		    case 'Gray': baseMap = 'Gray'; break;
		    case 'OSM': baseMap = 'n/a'; break;
		    case 'NatGeo': baseMap = 'NationalGeographic'; break;
		    case 'NatlMap': baseMap = 'n/a'; break;
		}

		setBasemap(baseMap);

	});
  	/* basemap controller */

	/* geocoder control */
	$('#geosearchNav').click(function(){
		$.noConflict()
		$('#geosearchModal').modal('show');
	});

	search_api.on("load", function() {
	    search_api.setOpts({
	        "textboxPosition" : "user-defined"
	    });
    });
	/* geocoder control */

	/* legend control */
	$('#legendButtonNavBar, #legendButtonSidebar').on('click', function () {
        $('#legend').toggle();
        //return false;
    });
    $('#legendClose').on('click', function () {
        $('#legend').hide();
    });
    /* legend control */


});