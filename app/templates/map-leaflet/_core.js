// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

//main document ready function
$( document ).ready(function() {

	'use strict';

	/* create map */
	var map = L.map('mapDiv').setView([37.77, -122.45], 12);
	L.esri.basemapLayer('NationalGeographic').addTo(map);

});