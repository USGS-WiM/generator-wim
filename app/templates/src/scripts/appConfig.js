
var app = {};
app.version = '0.0.0';
app.mapX = '-97.0';
app.mapY = '40.0';
app.zoomLevel = 4;

app.allLayers = [
        {
            "groupHeading": "WMS layers",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "ESRI Sample WMS": {
                    "url" : "https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer",
                    "options":{
                        "id": "esriSampleWMS",
                        //"format": "image/png",
                        "transparent":true,
                        "opacity": 0.6,
                        "visible": true,
                        //"extent": "-126.40869140625, 31.025390625, -109.66552734375, 41.5283203125",
                        //"wkid": 4326,
                        "resourceInfo": {},
                        "visibleLayers": ["1", "2"]
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisWMS",
                        "includeInLayerList": true,
                        "includeLegend": true,
                        "extent": {
                            "xmin": -126.40869140625,
                            "ymin": 31.025390625,
                            "xmax": -099.66552734375,
                            "ymax": 41.5283203125,
                            "wkid": 4326
                        }, "layerInfos": [{
                            "name": "1",
                            "title": "Rivers"
                        }, {
                            "name": "2",
                            "title": "Cities"
                        }]
                    }
                }
            },
            "groupHeading": "feature layers",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "FIM Sites": {
                    "url" : "https://gis.wim.usgs.gov/arcgis/rest/services/FIMMapper/sites/MapServer/0",
                    "options": {
                        "id": "fimSites",
                        "opacity": 0.75,
                        "visible": true
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto": true,
                        "includeLegend" : true
                    }
                }
            }
        },
        {
            "groupHeading": "radio button example",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "Cat 1":{
                    "url" : "https://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer",
                    "visibleLayers": [5,6,7],
                    "options":{
                        "id": "cat1",
                        "opacity": 1.0,
                        "visible": true
                    },
                    "wimOptions":{
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Coastal Erosion Hazard",
                        "includeLegend" : true
                    }
                },
                "Cat 2": {
                    "url" : "https://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer",
                    "visibleLayers": [13,14,15],
                    "options":{
                        "id": "cat2",
                        "opacity": 1.0,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Coastal Erosion Hazard",
                        "includeLegend" : true
                    }
                }
            }
        },
        {
            "groupHeading": "ESRI dynamic map services",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "Wetlands" : {
                    "url": "https://fwsprimary.wim.usgs.gov/server/rest/services/WetlandsProjects/Recent_and_Current_Projects/MapServer",
                    "options": {
                        "id": "Wetlands",
                        "opacity": 0.75,
                        "minScale": 144448,
                        "visible": true
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "zoomScale": 144448,
                        "hasOpacitySlider": true,
                        "hasZoomto" : true,
                        "includeLegend" : true
                    }
                },
                "NAWQA networks" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/tablesTest/MapServer",
                    "options": {
                        "id": "nawqaNetworks",
                        "layers": [1],
                        "visible": false,
                        "opacity": 0.6
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto": true,
                        "includeLegend" : false
                    }
                }
            }
        }
    ]