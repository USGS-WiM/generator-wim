// Generated by Web Inormatics and Mapping on <%= (new Date).toISOString().split('T')[0] %> using <%= generatorInfo.name %> <%= generatorInfo.version %>

require([
    'esri/map', 
    'esri/dijit/HomeButton', 
    'esri/dijit/LocateButton', 
    'esri/geometry/webMercatorUtils',
    'dojo/on', 
    'dojo/domReady!'
    ], function(
        Map, 
        HomeButton, 
        LocateButton, 
        webMercatorUtils,
        on) 
    {
    app.map = new Map('mapDiv', {
        basemap: 'gray',  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [app.mapX, app.mapY], // longitude, latitude
        zoom: app.zoomLevel
    });

    //set app version
	$('#aboutModalTitle').append(' <small>v' + app.version + '</small>');

    //displays map scale on map load
    app.map.on("load", function() {
        var scale =  app.map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
        var initMapCenter = webMercatorUtils.webMercatorToGeographic(app.map.extent.getCenter());
        $('#latitude').html(initMapCenter.y.toFixed(3));
        $('#longitude').html(initMapCenter.x.toFixed(3));
    });

    //displays map scale on scale change (i.e. zoom level)
    app.map.on('zoom-end', function () {
        var scale =  app.map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
    });

    //updates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes 'map center' label
    app.map.on('mouse-move', function (cursorPosition) {
        $('#mapCenterLabel').css('display', 'none');
        if (cursorPosition.mapPoint != null) {
            var geographicMapPt = webMercatorUtils.webMercatorToGeographic(cursorPosition.mapPoint);
            $('#latitude').html(geographicMapPt.y.toFixed(3));
            $('#longitude').html(geographicMapPt.x.toFixed(3));
        }
    });
    //updates lat/lng indicator to map center after pan and shows 'map center' label.
    app.map.on('pan-end', function () {
        //displays latitude and longitude of map center
        $('#mapCenterLabel').css('display', 'inline');
        var geographicMapCenter = webMercatorUtils.webMercatorToGeographic(app.map.extent.getCenter());
        $('#latitude').html(geographicMapCenter.y.toFixed(3));
        $('#longitude').html(geographicMapCenter.x.toFixed(3));
    });

    // USGS Search
    search_api.create( "geosearch", {
        on_result: function(o) {
            // what to do when a location is found
            // o.result is geojson point feature of location with properties
            // zoom to location
            require(["esri/geometry/Extent"], function(Extent) {
                var noExtents = ["GNIS_MAJOR", "GNIS_MINOR", "ZIPCODE", "AREACODE"];
                var noExtentCheck = noExtents.indexOf(o.result.properties["Source"])
                $("#geosearchModal").modal('hide');
                if (noExtentCheck == -1) {
                    app.map.setExtent(
                        new esri.geometry.Extent({
                            xmin: o.result.properties.LonMin,
                            ymin: o.result.properties.LatMin,
                            xmax: o.result.properties.LonMax,
                            ymax: o.result.properties.LatMax,
                            spatialReference: {"wkid":4326}
                        }),
                        true
                    );
                } else {
                    require( ["esri/geometry/Point"], function(Point) {
                        app.map.centerAndZoom(
                            new Point( o.result.properties.Lon, o.result.properties.Lat ),
                            12
                        );
                    });
                }
            });
             
        },
        "include_usgs_sw": true,
        "include_usgs_gw": true,
        "include_usgs_sp": true,
        "include_usgs_at": true,
        "include_usgs_ot": true,
        "include_huc2": true,
        "include_huc4": true,
        "include_huc6": true,
        "include_huc8": true,
        "include_huc10": true,
        "include_huc12": true,
        
        on_failure: function(o){
        $("#test").html("Sorry, a location could not be found in search for '"+o.val()+"'");
           $("#invalidSearchLocationModal").modal('show');
        }
    });

    //button for returning to initial extent
    var home = new HomeButton({
        map: app.map
    }, 'homeButton');
    home.startup();
    //button for finding and zooming to user's location
    var locate = new LocateButton({
        map: app.map
    }, 'locateButton');
    locate.startup();

    //basemap toggles
    $('#btnStreets').click(function() {
        app.map.setBasemap('streets');
    });
    $('#btnSatellite').click(function() {
        app.map.setBasemap('satellite');
    });
    $('#btnTopo').click(function() {
        app.map.setBasemap('topo');
    });
    $('#btnTerrain').click(function() {
        app.map.setBasemap('terrain');
    });
    $('#btnGray').click(function() {
        app.map.setBasemap('gray');
    });
    $('#btnNatGeo').click(function() {
        app.map.setBasemap('national-geographic');
    });

    //mobile menu toggle
    $('#mobile-main-menu').click(function() {
		$('body').toggleClass('isOpenMenu');
	});

    // Modals
    $(document).ready(function(){
        function showModal() {
            $('#geosearchModal').modal('show');
        }

        $('#geosearchButton').click(function(){
            showModal();
        });

        //about modal toggle
        $('#aboutButton').click(function() {
            $('#aboutModal').modal('show');
        });

        $('#geosearchButton').click(function(){
            showModal();
        });
    });
});