
//main document ready function
$( document ).ready(function() {

	//for jshint
	'use strict';

	/* create map */
	var map = L.map('mapDiv').setView([39.833333, -98.583333], 4);
	var layer = L.esri.basemapLayer('NationalGeographic').addTo(map);
	var layerLabels;

	$('#mapDiv').height($('body').height());
	map.invalidateSize();
	/* create map */

	//getLocation();

	/* parse layers.js */

	//create global layers lookup
	var mapLayers = [];

	$.each(allLayers, function (index,group) {
		console.log('processing: ', group.groupHeading)

		//sub-loop over layers within this groupType
		$.each(group.layers, function (layerName,layerDetails) {

			//check for exclusiveGroup for this layer
			var exclusiveGroupName = '';
			if (layerDetails.wimOptions.exclusiveGroupName) {
				exclusiveGroupName = layerDetails.wimOptions.exclusiveGroupName;
			}

			if (layerDetails.wimOptions.layerType === 'agisFeature') {	
				var layer = L.esri.featureLayer(layerDetails.url);
				addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName);
				addMapServerLegend(layerName, layerDetails);
			}

			else if (layerDetails.wimOptions.layerType === 'agisWMS') {
				var layer = L.tileLayer.wms(layerDetails.url, layerDetails.options).addTo(map);
				addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName);
				addMapServerLegend(layerName, layerDetails);
			}

			else if (layerDetails.wimOptions.layerType === 'agisDynamic') {
				var layer = new L.esri.Layers.DynamicMapLayer(layerDetails.url, layerDetails.options).addTo(map);
				addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName);
				addMapServerLegend(layerName, layerDetails);
			}		
	    });  
	});

	function getLocation() {

		$.ajax({
			dataType: "jsonp",
			url: "http://freegeoip.net/json/",
			error: function (jqXHR, textStatus, errorThrown) {
				console.log("IP Geolocation Error: ", textStatus);

				//if timeout, do this
				if (textStatus == 'timeout') {
					//ZoomManager(0);
				}
			},
			success: function (data) {
				console.log("IP Geolocation Success: ", data);

				//zoom to location
				map.setView([data.latitude, data.longitude], 9)
			},
			timeout: 3000
		});
	}

	function addLayer(groupHeading, showGroupHeading, layer, layerName, exclusiveGroupName) {

		//add layer to map
		layer.addTo(map);

		//add layer to layer list
		mapLayers.push([exclusiveGroupName,camelize(layerName),layer]);
		
		//check if its an exclusiveGroup item
		if (exclusiveGroupName) {

			//create radio button
			var button = $('<input type="radio" name="' + camelize(exclusiveGroupName) + '" value="' + camelize(layerName) + '"checked>' + layerName + '</input></br>');

			//click listener for radio button
		    button.click(function(e) {

		    	var newLayer = $(this).val();

			    $.each(mapLayers, function () {

			    	if (this[0] == exclusiveGroupName) {
			    		if (this[1] == newLayer) {
				    		console.log('adding layer: ',this[1]);
				    		map.addLayer(this[2]);
				    		$('#' + camelize(this[1])).toggle();
				    	}
				    	else {
				    		if (map.hasLayer(this[2])) {
				    			console.log('removing layer: ',this[1]);
				    			map.removeLayer(this[2]);
				    			//$('#' + camelize(this[1])).toggle();
				    		}
				    	}
			    	}
			    });
			});
		}

		//not an eclusive group item
		else {

			//create layer toggle
			var button = $('<div align="left" style="cursor: pointer;padding:5px;"><span class="glyphspan glyphicon glyphicon-ok"></span>&nbsp;&nbsp;' + layerName + '</div>');

			//click listener for regular button
		    button.click(function(e) {

		    	//toggle checkmark
		    	$(this).find('span.glyphspan').toggleClass('glyphicon glyphicon-ok');

				e.preventDefault();
		        e.stopPropagation();

		        $('#' + camelize(layerName)).toggle();

		        //layer toggle
		        if (map.hasLayer(layer)) {
		            map.removeLayer(layer);
		        } else {
		            map.addLayer(layer);
		        }
			});
		}

	    //group heading logic
		if (showGroupHeading) {

			//camelize it for divID
			var groupDivID = camelize(groupHeading);

			//check to see if this group already exists
			if (!$('#' + groupDivID).length) {
				//if it doesn't add the header
				var groupDiv = $('<div id="' + groupDivID + '"><div class="alert alert-info" role="alert"><strong>' + groupHeading + '</strong></div></div>');
				$('#toggle').append(groupDiv);
			}

			//if it does already exist, append to it
			$('#' + groupDivID).append(button);
		}

		else {
			//otherwise append
			$('#toggle').append(button);
		}	
	}

	function camelize(str) {
	  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
	    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	  }).replace(/\s+/g, '');
	}

	//get visible and non visible layer lists
	function addMapServerLegend(layerName, layerDetails) {


		if (layerDetails.wimOptions.layerType === 'agisFeature') {	

			//for feature layer since default icon is used, put that in legend
			var legendItem = $('<div align="left" id="' + camelize(layerName) + '"><img alt="Legend Swatch" src="https://raw.githubusercontent.com/Leaflet/Leaflet/master/dist/images/marker-icon.png" /><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
			$('#legendDiv').append(legendItem);
			
		}

		else if (layerDetails.wimOptions.layerType === 'agisWMS') {

			//for WMS layers, for now just add layer title
			var legendItem = $('<div align="left" id="' + camelize(layerName) + '"><img alt="Legend Swatch" src="http://placehold.it/25x41" /><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
			$('#legendDiv').append(legendItem);

		}

		else if (layerDetails.wimOptions.layerType === 'agisDynamic') {

			//create new legend div
        	var legendItemDiv = $('<div align="left" id="' + camelize(layerName) + '"><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');      
        	$('#legendDiv').append(legendItemDiv);

			//get legend REST endpoint for swatch
	        $.getJSON(layerDetails.url + '/legend?f=json', function (legendResponse) {

	        	console.log(layerName,'legendResponse',legendResponse);

	        	

	        	//make list of layers for legend
				if (layerDetails.options.layers) {
					//console.log(layerName, 'has visisble layers property')
					//if there is a layers option included, use that
					var visibleLayers = layerDetails.options.layers;
				}
				else {
					//console.log(layerName, 'no visible layers property',  legendResponse)
					
					//create visibleLayers array with everything
					var visibleLayers = [];
					$.grep(legendResponse.layers, function(i,v) {
					  	visibleLayers.push(v);
					});
				}

	            //loop over all map service layers
	            $.each(legendResponse.layers, function (i, legendLayer) {

	            	//var legendHeader = $('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong>');
	            	//$('#' + camelize(layerName)).append(legendHeader);

	            	//sub-loop over visible layers property
	           		$.each(visibleLayers, function (i, visibleLayer) {

	           			//console.log(layerName, 'visibleLayer',  visibleLayer);

		        		if (visibleLayer == legendLayer.layerId) {

		        			console.log(layerName, visibleLayer,legendLayer.layerId, legendLayer)

		        			//console.log($('#' + camelize(layerName)).find('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong></br>'))

		        			var legendHeader = $('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong></br>');
	        				$('#' + camelize(layerName)).append(legendHeader);

		        			//get legend object
			                var feature = legendLayer.legend;
			            /*
			                //build legend html for categorized feautres
			                if (feature.length > 1) {
			             */

			                	//placeholder icon
			                	//<img alt="Legend Swatch" src="http://placehold.it/25x41" />

			                    $.each(feature, function () {

			                    	//make sure there is a legend swatch
			                    	if (this.imageData) {
				                        var legendFeature = $('<img alt="Legend Swatch" src="data:image/png;base64,' + this.imageData + '" /><small>' + this.label.replace('<', '').replace('>', '') + '</small></br>');

				                        $('#' + camelize(layerName)).append(legendFeature);
				                    }
			                    });
			             /*
			                }
			                //single features
			                else {
			                	var legendFeature = $('<img alt="Legend Swatch" src="data:image/png;base64,' + feature[0].imageData + '" /><small>&nbsp;&nbsp;' + legendLayer.layerName + '</small></br>');

			                	//$('#legendDiv').append(legendItem);
			                	$('#' + camelize(layerName)).append(legendFeature);
		
			                }
			             */
		        		}
		            }); //each visible layer
	            }); //each legend item
	        }); //get legend json
		}	
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

	search_api.on('load', function() {
	    search_api.setOpts({
	        'textboxPosition' : 'user-defined'
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