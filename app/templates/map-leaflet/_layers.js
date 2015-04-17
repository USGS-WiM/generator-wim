var allLayers = [
    {
        "groupHeading": "some layers",
        "showGroupHeading": true,
        "includeInLayerList": true,
        "layers": {
            "ESRI Sample WMS": {
                "url" : "http://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer",
                "options":{
                    "id": "esriSampleWMS",
                    "format": "image/png",
                    "transparent":true,
                    "opacity": 0.6,
                    "visible": true,
                    "extent": "126.40869140625, 31.025390625, -109.66552734375, 41.5283203125",
                    "wkid": 4326,
                    "layerInfos": [{
                        "name": "1",
                        "title": "Rivers"
                    }, {
                        "name": "2",
                        "title": "Cities"
                    }],
                    "layers": ["1", "2"]
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisWMS",
                    "includeInLayerList": true
                }
            }, 
            "NOAA Flood Warnings": {
                "url" : "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa",
                "options":{
                    "id": "noaaFloodWarn",
                    "format": "image/png",
                    "transparent":true,
                    "opacity": 0.6,
                    "visible": true,
                    "extent": "-127.177734375,17.578125,-65.302734375,52.470703125", 
                    "wkid": 4326,
                    "layerInfos": [{
                        "name": "floodWarnLyr",
                        "title": "Flood Warnings",
                        "transparent": false
                    }],
                    "layers": ["WARN_SHORT_FLW"]
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisWMS",
                    "includeInLayerList": true,
                    "includeLegend": true,
                    "staticLegendOptions": {
                        "hasStaticLegend": true,
                        "legendTitle": "NOAA Flood Warnings (not the right legend, by the way)",
                        "legendUrl": "http://nowcoast.noaa.gov/LayerInfo?layer=NHC_TRACK_POLY&data=legend"
                    }
                }
            }
        }
    },
    {
        "groupHeading": "some other layers",
        "showGroupHeading": true,
        "includeInLayerList": true,
        "layers": {
            "Pt Feature Layer": {
                "url" : "http://wim.usgs.gov/arcgis/rest/services/BadRiverDataPortal/NWIS_Sites/MapServer/0",
                "options": {
                    "id": "ptFeatureLayer",
                    "visible": true
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisFeature",
                    "includeInLayerList": true
                }
            }, 
            "FIM Sites": {
                "url" : "http://fimlb-1071089098.us-east-1.elb.amazonaws.com/arcgis/rest/services/FIMMapper/sites/MapServer/0",
                "options": {
                    "opacity": 0.75,
                    "visible": true
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisFeature",
                    "includeInLayerList": true
                }
            }
        }
    },
    {
        "groupHeading": "exclusive group",
        "showGroupHeading": true,
        "includeInLayerList": true,
        "layers": {
            "Cat 2": {
                "url" : "http://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer",
                "options":{
                    "id": "cat2",
                    "layers": [13,14,15],
                    "opacity": 1.0
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisDynamic",
                    "includeInLayerList": true,
                    "exclusiveGroupName":"Coastal Erosion Hazard",
                    "visible": false
                }
            }, 
            "Cat 1":{
                "url" : "http://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer",
                "options":{
                    "id": "cat1",
                    "layers": [5,6,7],
                    "opacity": 1.0
                },
                "wimOptions":{
                    "type": "layer",
                    "layerType": "agisDynamic",
                    "includeInLayerList": true,
                    "exclusiveGroupName":"Coastal Erosion Hazard",
                    "visible": true
                }
            }
        }
    },
    {
        "groupHeading": "other map servers",
        "showGroupHeading": true,
        "includeInLayerList": true,
        "layers": {
            "Wetlands" : {
                "url": "http://107.20.228.18/ArcGIS/rest/services/Wetlands/MapServer",
                "options": {
                    "opacity": 0.75,
                    "visible": true
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisDynamic",
                    "includeInLayerList": true,
                    "zoomScale": 144448
                }
            }, 
            "NAWQA networks" : {
                "url": "http://wimsharedlb-418672833.us-east-1.elb.amazonaws.com/arcgis/rest/services/NAWQA/tablesTest/MapServer",
                "options": {
                    "layers": [1], 
                    "visible": true, 
                    "opacity": 0.6
                },
                "wimOptions": {
                    "type": "layer",
                    "layerType": "agisDynamic",
                    "includeInLayerList": true
                }
            }
        }
    }
]