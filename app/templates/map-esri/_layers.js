function initLayers() {

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

        var allLayers;    
        var legendLayers = [];
        var layersObject = [];
        var layerArray = [];
        var staticLegendImage;
        var identifyTask, identifyParams;
        var navToolbar;
        var locator;

        allLayers = {
            "ESRI Sample WMS": {
                "url" : "http://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer",
                "arcOptions":{
                    "id": "esriSampleWMS",
                    "opacity": 0.6,
                    "visible": false,
                    "resourceInfo":  {
                        "extent": new esri.geometry.Extent(-126.40869140625, 31.025390625, -109.66552734375, 41.5283203125, {
                            "wkid": 4326
                        }),
                        "layerInfos": [new esri.layers.WMSLayerInfo({
                            "name": "1",
                            "title": "Rivers"
                        }), new esri.layers.WMSLayerInfo({
                            "name": "2",
                            "title": "Cities"
                        })]
                     },
                    "visibleLayers": ['1', '2']
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisWMS",
                    "includeInLayerList": true
                }
            }, "NOAA Flood Warnings": {
                "url" : "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa",
                "arcOptions":{
                    "id": "noaaFloodWarn",
                    "opacity": 0.6,
                    "visible": false,
                    "resourceInfo":  {
                        "extent": new esri.geometry.Extent( -127.177734375,17.578125,-65.302734375,52.470703125, {
                            "wkid": 4326
                        }),
                        "layerInfos": [new esri.layers.WMSLayerInfo({
                            "name": 'floodWarnLyr',
                            "title": 'Flood Warnings',
                            "transparent": false
                        })]
                     },
                    "visibleLayers": ['WARN_SHORT_FLW']
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisWMS",
                    "includeInLayerList": true,
                    "includeLegend": true,
                    "staticLegendOptions": {
                        "hasStaticLegend": true,
                        //this is not the right legend for this layer. just a place holder url
                        "legendTitle": "NOAA Flood Warnings (not the right legend, by the way)",
                        "legendUrl": "http://nowcoast.noaa.gov/LayerInfo?layer=NHC_TRACK_POLY&data=legend"
                    }
                }
            }, "WMS Heading": {
                "wimOptions": {
                    "type": "heading",
                    "includeInLayerList": true
                }
            }, "Cat 2": {
                "url" : "http://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer/",
                "visibleLayers": [13,14,15],
                "arcOptions":{
                    "id": "cat2",
                    "opacity": 1.0,
                    "visible": false
                },
                "wimOptions": {
                    "type": "layer",
                    "includeInLayerList": true,
                    "layerOptions":{
                        "selectorType": "radio",
                        "radioGroup": "coastalErode"
                    }
                }
            }, "Cat 1":{
                "url" : "http://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer/",
                "visibleLayers": [5,6,7],
                "arcOptions":{
                    "id": "cat1",
                    "opacity": 1.0,
                    "visible": false
                },
                "wimOptions":{
                    "type": "layer",
                    "includeInLayerList": true,
                    "layerOptions":{
                        "selectorType": "radio",
                        "radioGroup": "coastalErode"
                    }
                }
            }, "Coastal Erosion Hazard":{
                "wimOptions": {
                    "type": "radioParent",
                    "includeInLayerList": true,
                    "layerOptions": {
                        "selectorType": "radioParent",  
                        "radioGroup": "coastalErode"
                    }
                }
            }, "Radio Group Heading": {
                "wimOptions": {
                    "type": "heading",
                    "includeInLayerList": true
                }
            }, "Pt Feature Layer" : {
                "url": "http://wim.usgs.gov/arcgis/rest/services/BadRiverDataPortal/NWIS_Sites/MapServer/0",
                "arcOptions": {
                    "id": "ptFeatureLayer",
                    "visible": true,
                    "mode": esri.layers.FeatureLayer.MODE_SNAPSHOT
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisFeature",
                    "includeInLayerList": true
                }
            }, "FIM Sites" : {
                "url": "http://fimlb-1071089098.us-east-1.elb.amazonaws.com/arcgis/rest/services/FIMMapper/sites/MapServer/0",
                "arcOptions": {
                    "opacity": 0.75,
                    "visible": true,
                    "mode": esri.layers.FeatureLayer.MODE_SNAPSHOT
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisFeature",
                    "includeInLayerList": true,
                }
            }, "Feature Layers": {
                "wimOptions": {
                    "type": "heading",
                    "includeInLayerList": true
                }
            }, "Wetlands" : {
                "url": "http://107.20.228.18/ArcGIS/rest/services/Wetlands/MapServer",
                "arcOptions": {
                    "opacity": 0.75,
                    "visible": true
                },
                "wimOptions": {
                    "type": "layer",
                    "includeInLayerList": true,
                    "zoomScale": 144448
                }
            }, "NAWQA networks" : {
                "url": "http://wimsharedlb-418672833.us-east-1.elb.amazonaws.com/arcgis/rest/services/NAWQA/tablesTest/MapServer",
                "visibleLayers": [1], 
                "arcOptions": {
                    "visible": true, 
                    "opacity": 0.6
                },
                "wimOptions": {
                    "type": "layer",
                    "includeInLayerList": true
                }
            }, "Dynamic Layers": {
                "wimOptions": {
                    "type": "heading",
                    "includeInLayerList": true
                }
            }
        };

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

                for (layer in allLayers) {
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
}

dojo.ready(initLayers)