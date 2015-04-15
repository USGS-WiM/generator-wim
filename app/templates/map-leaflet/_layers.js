var allLayers = {
            'ESRI Sample WMS': {
                'url' : 'http://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer',
                'options':{
                    'id': 'esriSampleWMS',
                    'format': 'image/png',
                    'transparent':true,
                    'opacity': 0.6,
                    'visible': true,
                    'extent': '126.40869140625, 31.025390625, -109.66552734375, 41.5283203125',
                    'wkid': 4326,
                    'layerInfos': [{
                        'name': '1',
                        'title': 'Rivers'
                    }, {
                        'name': '2',
                        'title': 'Cities'
                    }],
                    'layers': ['1', '2']
                },
                'wimOptions': {
                    'type': 'layer',
                    'layerType': 'agisWMS',
                    'includeInLayerList': true
                }
            }, 'NOAA Flood Warnings': {
                'url' : 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa',
                'options':{
                    'id': 'noaaFloodWarn',
                    'format': 'image/png',
                    'transparent':true,
                    'opacity': 0.6,
                    'visible': true,
                    'extent': '-127.177734375,17.578125,-65.302734375,52.470703125', 
                    'wkid': 4326,
                    'layerInfos': [{
                        'name': 'floodWarnLyr',
                        'title': 'Flood Warnings',
                        'transparent': false
                    }],
                    'layers': ['WARN_SHORT_FLW']
                },
                'wimOptions': {
                    'type': 'layer',
                    'layerType': 'agisWMS',
                    'includeInLayerList': true,
                    'includeLegend': true,
                    'staticLegendOptions': {
                        'hasStaticLegend': true,
                        //this is not the right legend for this layer. just a place holder url
                        'legendTitle': 'NOAA Flood Warnings (not the right legend, by the way)',
                        'legendUrl': 'http://nowcoast.noaa.gov/LayerInfo?layer=NHC_TRACK_POLY&data=legend'
                    }
                }
            }, 'WMS Heading': {
                'wimOptions': {
                    'type': 'heading',
                    'includeInLayerList': true
                }
            }, 'Cat 2': {
                'url' : 'http://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer/',
                'visibleLayers': [13,14,15],
                'options':{
                    'id': 'cat2',
                    'opacity': 1.0,
                    'visible': false
                },
                'wimOptions': {
                    'type': 'layer',
                    'includeInLayerList': true,
                    'layerOptions':{
                        'selectorType': 'radio',
                        'radioGroup': 'coastalErode'
                    }
                }
            }, 'Cat 1':{
                'url' : 'http://olga.er.usgs.gov/stpgis/rest/services/Vulnerability/NACCH_change_probabilities/MapServer/',
                'visibleLayers': [5,6,7],
                'options':{
                    'id': 'cat1',
                    'opacity': 1.0,
                    'visible': false
                },
                'wimOptions':{
                    'type': 'layer',
                    'includeInLayerList': true,
                    'layerOptions':{
                        'selectorType': 'radio',
                        'radioGroup': 'coastalErode'
                    }
                }
            }, 'Coastal Erosion Hazard':{
                'wimOptions': {
                    'type': 'radioParent',
                    'includeInLayerList': true,
                    'layerOptions': {
                        'selectorType': 'radioParent',  
                        'radioGroup': 'coastalErode'
                    }
                }
            }, 'Radio Group Heading': {
                'wimOptions': {
                    'type': 'heading',
                    'includeInLayerList': true
                }
            }, 'Pt Feature Layer' : {
                'url': 'http://wim.usgs.gov/arcgis/rest/services/BadRiverDataPortal/NWIS_Sites/MapServer/0',
                'options': {
                    'id': 'ptFeatureLayer',
                    'visible': true
                },
                'wimOptions': {
                    'type': 'layer',
                    'layerType': 'agisFeature',
                    'includeInLayerList': true
                }
            }, 'FIM Sites' : {
                'url': 'http://fimlb-1071089098.us-east-1.elb.amazonaws.com/arcgis/rest/services/FIMMapper/sites/MapServer/0',
                'options': {
                    'opacity': 0.75,
                    'visible': true
                },
                'wimOptions': {
                    'type': 'layer',
                    'layerType': 'agisFeature',
                    'includeInLayerList': true,
                }
            }, 'Feature Layers': {
                'wimOptions': {
                    'type': 'heading',
                    'includeInLayerList': true
                }
            }, 'Wetlands' : {
                'url': 'http://107.20.228.18/ArcGIS/rest/services/Wetlands/MapServer',
                'options': {
                    'opacity': 0.75,
                    'visible': true
                },
                'wimOptions': {
                    'type': 'layer',
                    'includeInLayerList': true,
                    'zoomScale': 144448
                }
            }, 'NAWQA networks' : {
                'url': 'http://wimsharedlb-418672833.us-east-1.elb.amazonaws.com/arcgis/rest/services/NAWQA/tablesTest/MapServer',
                'visibleLayers': [1], 
                'options': {
                    'visible': true, 
                    'opacity': 0.6
                },
                'wimOptions': {
                    'type': 'layer',
                    'includeInLayerList': true
                }
            }, 'Dynamic Layers': {
                'wimOptions': {
                    'type': 'heading',
                    'includeInLayerList': true
                }
            }
        };