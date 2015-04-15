// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

//main document ready function
$( document ).ready(function() {

	'use strict';

	/* create map */
	var map = L.map('mapDiv').setView([39.833333, -98.583333], 4);
	var layer = L.esri.basemapLayer('NationalGeographic').addTo(map);
	var layerLabels;


    var groupedOverlays = {};
	var layerControl = L.control.groupedLayers(null, groupedOverlays, {collapsed: false});

	//hack to put layer control in different div
	layerControl._map = map;
	var controlDiv = layerControl.onAdd(map);
	$('#toggle').append(controlDiv);

	$('#mapDiv').height($('body').height());
	map.invalidateSize();
	/* create map */

	/* parse layers.js */
	$.each(allLayers, function (i,v) {

		//make sure not a heading
		if (!(v.wimOptions.type == "heading" || v.wimOptions.type == "radioParent")) {

			if (v.visibleLayers) {
				var visibleLayers = v.visibleLayers
			}
			else var visibleLayers = '';

			console.log('looping over alllayers object, currently: ', v.url, visibleLayers, i)

			if (v.wimOptions.layerType == "agisFeature") {
				

				var featureLayer = L.esri.featureLayer(v.url).addTo(map);
	            layerControl.addOverlay(featureLayer, i, "Feature Layers");

			}

			else if (v.wimOptions.layerType == "agisWMS") {
				

				var wmsLayer = L.tileLayer.wms(v.url, v.options).addTo(map);
	            layerControl.addOverlay(wmsLayer, i, "WMS Layers");

			}
			else {



				
				addMapServerLegend(v.url, visibleLayers, i)
				//var mapLayer = new L.esri.Layers.DynamicMapLayer(v.url, v.options).addTo(map);
				//layerControl.addOverlay(mapLayer, i + '<img alt="Legend Swatch" src="/images/purple-pin.png" />', "Map Layers");

			}
		}
		
	});

	//get visible and non visible layer lists
	function addMapServerLegend(mapService, visibleLayers, groupName) {

		

	    //get layers REST endpoint for default visible layer info
	    $.getJSON(mapService + '/layers?f=pjson', function (layersResponse) {

	    	console.log('in addmapserverLegend: ', groupName, layersResponse);
	        var mapServiceLayers = [];
	        $.each(layersResponse.layers, function () {

	            if (this.defaultVisibility == true) {
	                mapServiceLayers.push([this.id, this.name, true]);
	            }
	            else {
	                mapServiceLayers.push([this.id, this.name, false]);
	            }
	        });

	        //get legend REST endpoint for swatch
	        $.getJSON(mapService + '/legend?f=pjson', function (legendResponse) {

	        	console.log(groupName, ' mapservicelayers: ',mapServiceLayers);

	            //loop over default visible layers
	            $.each(mapServiceLayers, function () {

	            	//make sure layer is part of visiblelayers array of layers.js
	            	if (visibleLayers.indexOf(this[0]) != -1) {

	            		console.log(groupName, this[0], visibleLayers,'legend: ',legendResponse.layers[this[0]].legend.length )
		                var feature = legendResponse.layers[this[0]].legend;

		                //swatch title
		                var swatch = '<span>' + this[1] + '</span></br>';

		                //build legend html for categorized feautres
		                if (feature.length > 1) {
		                    $.each(feature, function () {
		                        swatch += '<img alt="Legend Swatch" src="data:image/png;base64,' + this.imageData + '" /><span>' + this.label.replace('<', '').replace('>', '') + '</span></br>'
		                    })
		                }
		                //single features
		                else {
		                    swatch = '<img alt="Legend Swatch" src="data:image/png;base64,' + feature[0].imageData + '" /><span>' + this[1] + '</span>';
		                }

		                //create layer and add to layer control 
		                
		                var singleLayer = new L.esri.dynamicMapLayer(mapService, { layers: [this[0]] });
		                layerControl.addOverlay(singleLayer, swatch, '<span><strong>' + groupName + '</strong></span>');

		                //if default visibility is true, turn on layer
		                if (this[2]) {
		                    singleLayer.addTo(map);
		                }
		            }
	            }); //each visible layer
	        }); //get legend json
	    });  //get layers json
	}
	/* parse layers.js */

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
/*
	$('#geosearchNav').click(function(){
		$.noConflict()
		$('#geosearchModal').modal('show');
	});

	search_api.on("load", function() {
	    search_api.setOpts({
	        "textboxPosition" : "user-defined"
	    });
    });
*/
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