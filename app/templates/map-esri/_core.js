//for jshint
'use strict';
// Generated on 2015-04-13 using generator-wim 0.0.1

/**
 * Created by bdraper on 4/3/2015.
 */

var map;
var allLayers;

require([
    'esri/map',
    "esri/dijit/HomeButton",
    'application/bootstrapmap',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/dijit/Geocoder',
    'esri/dijit/PopupTemplate',
    'esri/graphic',
    'esri/geometry/Multipoint',
    'esri/symbols/PictureMarkerSymbol',
    "esri/geometry/webMercatorUtils",
    'dojo/dom',
    'dojo/on',
    'dojo/domReady!'
], function (
    Map,
    HomeButton,
    BootstrapMap,
    ArcGISTiledMapServiceLayer,
    Geocoder,
    PopupTemplate,
    Graphic,
    Multipoint,
    PictureMarkerSymbol,
    webMercatorUtils,
    dom,
    on
) {

    allLayers = mapLayers;

    map = Map('mapDiv', {
        basemap: 'national-geographic',
        center: [-95.6, 38.6],
        zoom: 4
    });
    var home = new HomeButton({
        map: map
    }, "homeButton");
    home.startup();

    //following block forces map size to override problems with default behavior
    $('#mapDiv').height($('body').height());
    map.resize();
    var idealMapHeight = $(window).height() - $('#navbar').height();
    $('#mapDiv, #mapDiv_root').height(idealMapHeight + 'px');
    $(window).resize(function () {
        $('#mapDiv, #mapDiv_root').height(idealMapHeight + 'px');
    });

    //displays map scale on map load
    on(map, "load", function() {
        var scale =  map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
        var initMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
        $('#latitude')[0].innerHTML = initMapCenter.y.toFixed(3);
        $('#longitude')[0].innerHTML = initMapCenter.x.toFixed(3);

    });
    //displays map scale on scale change (i.e. zoom level)
    on(map, "zoom-end", function () {
        var scale =  map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
    });

    //updates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes "map center" label used for touch devices
    on(map, "mouse-move", function (cursorPosition) {
        $('#mapCenterLabel').css("display", "none");
        if (cursorPosition.mapPoint != null) {
            var geographicMapPt = webMercatorUtils.webMercatorToGeographic(cursorPosition.mapPoint);
            $('#latitude')[0].innerHTML = geographicMapPt.y.toFixed(3);
            $('#longitude')[0].innerHTML = geographicMapPt.x.toFixed(3);
        }
    });
    //updates lat/lng indicator to map center after pan and shows "map center" label. media match check applies it only to smaller screens
    on(map, "pan-end", function () {
        if (window.matchMedia("(min-width: 768px)").matches) {
            /* the viewport is at least 768 pixels wide */
            //displays latitude and longitude on cursor move
            $('#mapCenterLabel').css("display", "none");
            return
        } else {
            /* the viewport is less than 768 pixels wide */
            //displays latitude and longitude of map center
            $('#mapCenterLabel').css("display", "inline");
            var geographicMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
            $('#latitude')[0].innerHTML = geographicMapCenter.y.toFixed(3);
            $('#longitude')[0].innerHTML = geographicMapCenter.x.toFixed(3);

        }
    });

    var nationalMapBasemap = new ArcGISTiledMapServiceLayer('http://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer');
    //on clicks to swap basemap. map.removeLayer is required for nat'l map b/c it is not technically a basemap, but a tiled layer.
    on(dom.byId('btnStreets'), 'click', function () {
        map.setBasemap('streets');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnSatellite'), 'click', function () {
        map.setBasemap('satellite');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnHybrid'), 'click', function () {
        map.setBasemap('hybrid');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnTerrain'), 'click', function () {
        map.setBasemap('terrain');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnGray'), 'click', function () {
        map.setBasemap('gray');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnNatGeo'), 'click', function () {
        map.setBasemap('national-geographic');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnOSM'), 'click', function () {
        map.setBasemap('osm');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnTopo'), 'click', function () {
        map.setBasemap('topo');
        map.removeLayer(nationalMapBasemap);
    });

    on(dom.byId('btnNatlMap'), 'click', function () {
        map.addLayer(nationalMapBasemap);
    });

    var geocoder = new Geocoder({
        value: '',
        maxLocations: 25,
        autoComplete: true,
        arcgisGeocoder: true,
        autoNavigate: false,
        map: map
    }, 'geosearch');
    geocoder.startup();
    geocoder.on('select', geocodeSelect);
    geocoder.on('findResults', geocodeResults);
    geocoder.on('clear', clearFindGraphics);
    on(geocoder.inputNode, 'keydown', function (e) {
        if (e.keyCode == 13) {
            setSearchExtent();
        }
    });

    // Symbols
    var sym = createPictureSymbol('../images/purple-pin.png', 0, 12, 13, 24);

    map.on('load', function (){
        map.infoWindow.set('highlight', false);
        map.infoWindow.set('titleInBody', false);
    });

    // Geosearch functions
    on(dom.byId('btnGeosearch'),'click', geosearch);

    // Optionally confine search to map extent
    function setSearchExtent (){
        if (dom.byId('chkExtent').checked === 1) {
            geocoder.activeGeocoder.searchExtent = map.extent;
        } else {
            geocoder.activeGeocoder.searchExtent = null;
        }
    }
    function geosearch() {
        setSearchExtent();
        var def = geocoder.find();
        def.then(function (res){
            geocodeResults(res);
        });
        // Close modal
        $('#geosearchModal').modal('hide');
    }
    function geocodeSelect(item) {
        clearFindGraphics();
        var g = (item.graphic ? item.graphic : item.result.feature);
        g.setSymbol(sym);
        addPlaceGraphic(item.result,g.symbol);
        // Close modal
        $('#geosearchModal').modal('hide');
    }
    function geocodeResults(places) {
        places = places.results;
        if (places.length > 0) {
            clearFindGraphics();
            var symbol = sym;
            // Create and add graphics with pop-ups
            for (var i = 0; i < places.length; i++) {
                addPlaceGraphic(places[i], symbol);
            }
            zoomToPlaces(places);
        } else {
            //alert('Sorry, address or place not found.');  // TODO
        }
    }
    function stripTitle(title) {
        var i = title.indexOf(',');
        if (i > 0) {
            title = title.substring(0,i);
        }
        return title;
    }
    function addPlaceGraphic(item,symbol)  {
        var place = {};
        var attributes,infoTemplate,pt,graphic;
        pt = item.feature.geometry;
        place.address = item.name;
        place.score = item.feature.attributes.Score;
        // Graphic components
        attributes = { address:stripTitle(place.address), score:place.score, lat:pt.getLatitude().toFixed(2), lon:pt.getLongitude().toFixed(2) };
        infoTemplate = new PopupTemplate({title:'{address}', description: 'Latitude: {lat}<br/>Longitude: {lon}'});
        graphic = new Graphic(pt,symbol,attributes,infoTemplate);
        // Add to map
        map.graphics.add(graphic);
    }

    function zoomToPlaces(places) {
        var multiPoint = new Multipoint(map.spatialReference);
        for (var i = 0; i < places.length; i++) {
            multiPoint.addPoint(places[i].feature.geometry);
        }
        map.setExtent(multiPoint.getExtent().expand(2.0));
    }

    function clearFindGraphics() {
        map.infoWindow.hide();
        map.graphics.clear();
    }

    function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
        return new PictureMarkerSymbol(
            {
                'angle': 0,
                'xoffset': xOffset, 'yoffset': yOffset, 'type': 'esriPMS',
                'url': url,
                'contentType': 'image/png',
                'width':xWidth, 'height': yHeight
            });
    }
    // Show modal dialog
    $(document).ready(function(){
        function showModal() {
            $('#geosearchModal').modal('show');
        }
        // Geosearch nav menu is selected
        $('#geosearchNav').click(function(){
            showModal();
        });
        $('#geosearchNav2').click(function(){
            showModal();
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    require([
        'esri/dijit/Legend',
        'esri/tasks/locator',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/graphicsUtils',
        'esri/geometry/Point',
        'esri/geometry/Extent',
        'esri/layers/WMSLayer',
        'esri/layers/WMSLayerInfo',
        'dijit/form/CheckBox',
        'dijit/form/RadioButton',
        'dojo/query',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/on'
    ], function(
        Legend,
        Locator,
        Query,
        QueryTask,
        graphicsUtils,
        Point,
        Extent,
        WMSLayer,
        WMSLayerInfo,
        CheckBox,
        RadioButton,
        query,
        dom,
        domClass,
        domConstruct,
        domStyle,
        on
    ) {

        var legendLayers = [];
        var layersObject = [];
        var layerArray = [];
        var staticLegendImage;
        var identifyTask, identifyParams;
        var navToolbar;
        var locator;

        //allLayers = layers;

        on(map, "layers-add-result", function() {

            var legend = new Legend({
                map:map,
                layerInfos:legendLayers
            },"legendDiv");
            legend.startup();

            //this counter to track first and last of items in legendLayers
            var i = 0;
            var lastItem = layersObject.length;

            dojo.forEach(layersObject, function(layer){

                var layerName = layer.title;

                if (layer.layer != "heading") {

                    if (layer.toggleType == "radioParent"){

                        var radioParentCheck = new CheckBox({
                            name:"radioParentCheck" + layer.group,
                            id:"radioParentCheck_" + layer.group,
                            params: {group: layer.group},
                            onChange:function(){
                                var radChildLayers = [];
                                var grp = this.params.group;
                                dojo.forEach (layersObject, function (layer){
                                    if (grp == layer.group && layer.toggleType != "radioParent") {
                                        radChildLayers.push(layer.layer);
                                    }
                                });
                                if (!this.checked){
                                    dojo.forEach (radChildLayers, function (layer){
                                        layer.setVisibility(false);
                                    });
                                    var divs = query("." + grp);
                                    for(var i = 0; i < divs.length; i++) {
                                        divs[i].style.display= "none";
                                    }
                                }
                                if (this.checked){
                                    var divs = query("." + grp);
                                    for(var i = 0; i < divs.length; i++) {
                                        divs[i].style.display= "block";
                                    }
                                    dojo.forEach (radChildLayers, function (layer){
                                        if (dojo.byId("radioButton"+layer.id).checked) {
                                            layer.setVisibility(true);
                                        }
                                    });
                                }
                            }
                        });
                        var toggleDiv = domConstruct.create("div");
                        domConstruct.place(toggleDiv,dom.byId("toggle"), 0 );
                        domConstruct.place(radioParentCheck.domNode,toggleDiv,"first");
                        domStyle.set(toggleDiv, "paddingLeft", "15px");
                        if (i === 0) {
                            domStyle.set(toggleDiv, "paddingBottom", "10px");
                        } else if (i == lastItem) {
                            domStyle.set(toggleDiv, "paddingTop", "10px");
                        }
                        var radioParentCheckLabel = domConstruct.create('label',{'for':radioParentCheck.name,innerHTML:layerName},radioParentCheck.domNode,"after");
                        domConstruct.place("<br/>",radioParentCheckLabel,"after");

                    } else if (layer.toggleType == "checkbox"){

                        var checkBox = new CheckBox({
                            name:"checkBox" + layer.layer.id,
                            id:"checkBox" + layer.layer.id,
                            value:layer.layer.id,
                            checked:layer.layer.visible,
                            onChange:function(){
                                var checkLayer = map.getLayer(this.value);
                                checkLayer.setVisibility(!checkLayer.visible);
                                this.checked = checkLayer.visible;
                            }
                        });
                        var toggleDiv = domConstruct.create("div");
                        domConstruct.place(toggleDiv,dom.byId("toggle"), 0 );
                        domConstruct.place(checkBox.domNode,toggleDiv,"first");
                        domStyle.set(toggleDiv, "paddingLeft", "15px");
                        if (i === 0) {
                            domStyle.set(toggleDiv, "paddingBottom", "10px");
                        } else if (i == lastItem) {
                            domStyle.set(toggleDiv, "paddingTop", "10px");
                        }
                        var checkLabel = domConstruct.create('label',{'for':checkBox.name,innerHTML:layerName},checkBox.domNode,"after");
                        domConstruct.place("<br/>",checkLabel,"after");

                    } else if (layer.toggleType == "radio") {

                        var radioButton = new RadioButton({
                            name: layer.group,
                            id: "radioButton" + layer.layer.id,
                            value:layer.layer.id,
                            checked:layer.layer.visible,
                            params: {group: layer.group},
                            onChange:function() {
                                var radioLayer = map.getLayer(this.value);
                                var parentID = "radioParentCheck_" + layer.group;

                                var checkedEval = (this.checked && dijit.byId(parentID).checked) ? true : false;
                                radioLayer.setVisibility(checkedEval);
                                //(this.checked && registry.byId(parentID).checked) ? radioLayer.setVisibility(true) : radioLayer.setVisibility(false);
                            }
                        });
                        var toggleDiv = domConstruct.create("div");
                        domConstruct.place(toggleDiv,dom.byId("toggle"), 0 );
                        domConstruct.place(radioButton.domNode,toggleDiv,"first");
                        domClass.add(toggleDiv, radioButton.params.group);
                        domStyle.set(toggleDiv, "paddingLeft", "25px");
                        domStyle.set(toggleDiv, "display", "none");
                        if (i === 0) {
                            domStyle.set(toggleDiv, "paddingBottom", "10px");
                        } else if (i == lastItem) {
                            domStyle.set(toggleDiv, "paddingTop", "10px");
                        }
                        var radioLabel = domConstruct.create('label',{'for':radioButton.name,innerHTML:layerName},radioButton.domNode,"after");
                        domConstruct.place("<br/>",radioLabel,"after");
                    }
                    /////code below for headings w/out toggles
                } else {

                    var headingDiv = domConstruct.create("div");
                    headingDiv.innerHTML = layer.title;
                    domConstruct.place(headingDiv,dom.byId("toggle"),"first");
                    domStyle.set(headingDiv, "paddingTop", "10px");
                    domStyle.set(headingDiv, "color", "#D3CFBA");
                    if (i === 0) {
                        domStyle.set(headingDiv, "paddingBottom", "10px");
                    } else if (i == lastItem) {
                        domStyle.set(headingDiv, "paddingTop", "10px");
                    }

                }
                i++;
                //don't miss this iterator!!!!!
            });
        });

        addAllLayers();

        function addAllLayers() {

            var radioGroup;
            var radioGroupArray = [];

            require([
                "esri/layers/ArcGISDynamicMapServiceLayer"
            ], function(
                ArcGISDynamicMapServiceLayer) {

                for ( var layer in allLayers) {
                    if (allLayers[layer].wimOptions.type == "layer") {
                        console.log(layer);
                        var newLayer;
                        if (allLayers[layer].wimOptions.layerType == "agisFeature") {
                            newLayer = new esri.layers.FeatureLayer(allLayers[layer].url, allLayers[layer].arcOptions);
                        } else if (allLayers[layer].wimOptions.layerType == "agisWMS") {
                            newLayer = new esri.layers.WMSLayer(allLayers[layer].url, allLayers[layer].arcOptions);
                            if (allLayers[layer].wimOptions.includeLegend == true && allLayers[layer].wimOptions.staticLegendOptions.hasStaticLegend == true) {
                                var staticLegendImage = dojo.doc.createElement("div");
                                staticLegendImage.id = allLayers[layer].arcOptions.id + 'Legend';
                                staticLegendImage.innerHTML = '<b style="">' + allLayers[layer].wimOptions.staticLegendOptions.legendTitle + '</b><br/><img style="padding-top: 10px; width: ' + (parseInt($("#explanation").width())-25).toString() + 'px" src="' + allLayers[layer].wimOptions.staticLegendOptions.legendUrl + '" />';
                                dojo.place(staticLegendImage,dojo.byId("legendDiv"),"after");
                                if (allLayers[layer].arcOptions.visible == false) {
                                    $("#" + staticLegendImage.id).hide();
                                }
                            }
                        } else {
                            newLayer = new esri.layers.ArcGISDynamicMapServiceLayer(allLayers[layer].url, allLayers[layer].arcOptions);
                            if (allLayers[layer].visibleLayers) {
                                newLayer.setVisibleLayers(allLayers[layer].visibleLayers);
                            }
                        }

                        //set wim options
                        if (allLayers[layer].wimOptions) {
                            if (allLayers[layer].wimOptions.includeInLayerList == true) {
                                if (allLayers[layer].wimOptions.layerOptions && allLayers[layer].wimOptions.layerOptions.selectorType == "radio" ) {

                                    radioGroup = allLayers[layer].wimOptions.layerOptions.radioGroup;
                                    radioGroupArray.push({group: radioGroup, layer:newLayer});

                                    addToObjects({layer: newLayer, type:"layer", title: layer, toggleType: "radio", group: radioGroup}, allLayers[layer].wimOptions)

                                } else {
                                    addToObjects({layer: newLayer, type:"layer", title: layer, toggleType: "checkbox", group: ""}, allLayers[layer].wimOptions)
                                }
                            }
                        } else {
                            addToObjects({layer: newLayer, title: layer}, allLayers[layer].wimOptions)
                        }
                        layerArray.push(newLayer);
                    } else if (allLayers[layer].wimOptions.type == "radioParent") {

                        radioGroup = allLayers[layer].wimOptions.layerOptions.radioGroup;
                        radioGroupArray.push({group: radioGroup, layer: null});

                        layersObject.push({layer: null, type: "radioParent", title: layer, toggleType: "radioParent", group: radioGroup});

                    } else {

                        layersObject.push({layer: "heading", title: layer});
                        console.log("heading: " + layer);
                    }
                }

                map.addLayers(layerArray);

                function addToObjects(fullObject, wimOptions) {
                    layersObject.push(fullObject);
                    if (wimOptions.includeLegend != false) {
                        legendLayers.push(fullObject);
                    }
                }

            });//end of require statement just for dynamic map service layer
        }//end of addAllLayers

    });//end of require statement containing legend building code

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});

$(document).ready(function () {
    //7 lines below are handler for the legend buttons. to be removed if we stick with the in-map legend toggle
    //$('#legendButtonNavBar, #legendButtonSidebar').on('click', function () {
    //    $('#legend').toggle();
    //    //return false;
    //});
    //$('#legendClose').on('click', function () {
    //    $('#legend').hide();
    //});

});