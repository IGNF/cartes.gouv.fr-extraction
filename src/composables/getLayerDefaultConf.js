export const DEFAULT_CONF2 =  {
          "hidden":true,
          "queryable":false,
          "serviceParams": {
            "id":"GPP:TMS",
            "version":"1.0.0",
            "serverUrl":{
              "full":"https://data.geopf.fr/tms/1.0.0/"
            }
          },
          "name":"PLAN.IGN",
          "title":"Plan IGN personnalisable",
          "description":"<p>Plan IGN personnalisable</p>\n",
          "formats":[{"current":true,
            "name":"application/x-protobuf"}],
          "metadata":[{"name":"sans_toponymes",
            "title":"sans_toponymes",
            "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/sans_toponymes.json"},
            {"name":"standard",
            "title":"standard",
            "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json"},
            {"name":"attenue",
              "title":"attenue",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/attenue.json"},
            {"name":"epure",
              "title":"epure",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/epure.json"},
            {"name":"toponymes",
              "title":"toponymes",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/toponymes.json"},
            {"name":"accentue",
              "title":"accentue",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/accentue.json"},
            {"name":"transparent",
              "title":"transparent",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/transparent.json"},
            {"name":"classique",
              "title":"classique",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/classique.json"},
            {"name":"IGNF_PLAN-IGN",
              "title":"IGNF_PLAN-IGN",
              "url":"https://cartes.gouv.fr/catalogue/dataset/IGNF_PLAN-IGN"},
            {"name":"gris",
              "title":"gris",
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/gris.json"},
            {"name":"2",
              "title":"2",
              "url":"https://data.geopf.fr/csw?REQUEST=GetRecordById&SERVICE=CSW&VERSION=2.0.2&OUTPUTSCHEMA=http://standards.iso.org/iso/19115/-3/mdb/2.0&elementSetName=full&ID=IGNF_PLAN-IGN"}],
            "styles":[{"name":"sans_toponymes",
              "title":"sans_toponymes",
              "current":true,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/sans_toponymes.json"},
              {"name":"standard",
              "title":"standard",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json"},
              {"name":"attenue",
              "title":"attenue",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/attenue.json"},
              {"name":"epure",
              "title":"epure",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/epure.json"},
              {"name":"toponymes",
              "title":"toponymes",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/toponymes.json"},
              {"name":"accentue",
              "title":"accentue",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/accentue.json"},
              {"name":"transparent",
              "title":"transparent",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/transparent.json"},
              {"name":"classique",
              "title":"classique",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/classique.json"},
              {"name":"gris",
              "title":"gris",
              "current":false,
              "url":"https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/gris.json"}],
            "globalConstraint":{"crs":"EPSG:3857",
              "bbox":{"left":-20026376.393709917,
              "right":20026376.393709917,
              "top":15538711.09630922,
              "bottom":-15538711.09630922},
            "minScaleDenominator":559082264.0287179,
            "maxScaleDenominator":2132.7295838497826},
            "defaultProjection":"EPSG:3857",
            "thumbnail":"https://data.geopf.fr/annexes/ressources/metadata/thumbnail/vignette-plan-ign.jpg",
            "producer":["INSTITUT NATIONAL DE L'INFORMATION GEOGRAPHIQUE ET FORESTIERE (IGN)"],
            "thematic":["Carte de référence de la couverture terrestre"],
            "metadata_urls":["https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/toponymes.json",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/sans_toponymes.json",
              "https://cartes.gouv.fr/catalogue/dataset/IGNF_PLAN-IGN",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/transparent.json",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/classique.json",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/epure.json",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/accentue.json",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/attenue.json",
              "https://data.geopf.fr/csw?REQUEST=GetRecordById&SERVICE=CSW&VERSION=2.0.2&OUTPUTSCHEMA=http://standards.iso.org/iso/19115/-3/mdb/2.0&elementSetName=full&ID=IGNF_PLAN-IGN",
              "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/gris.json"],
            "base":true,
            "key":"PLAN.IGN$GEOPORTAIL:GPP:TMS",
            "position":1,
            "opacity":1,
            "visible":true,
            "grayscale":false,
            "style":"standard",
            "service":"TMS",
            "categories":["base",
              80900460,
              548487533],
            "producer_urls":[{"name":"INSTITUT NATIONAL DE L'INFORMATION GEOGRAPHIQUE ET FORESTIERE (IGN)",
              "url":"https://cartes.gouv.fr/catalogue/search?organization=INSTITUT NATIONAL DE L'INFORMATION GEOGRAPHIQUE ET FORESTIERE (IGN)"}],
            "thematic_urls":[{"name":"Carte de référence de la couverture terrestre",
              "url":"https://cartes.gouv.fr/catalogue/search?topic=imageryBaseMapsEarthCover"}],
            "label":"Plan IGN personnalisable",
            "params":{"url":"https://data.geopf.fr/tms/1.0.0/",
              "styles":"sans_toponymes",
              "version":"1.0.0",
              "format":"application/x-protobuf",
              "projection":"EPSG:3857",
              "minScale":559082264.0287179,
              "maxScale":2132.7295838497826,
              "extent":{"left":-20026376.393709917,
              "right":20026376.393709917,
              "top":15538711.09630922,
              "bottom":-15538711.09630922},
            "title":"Plan IGN personnalisable",
            "description":"<p>Plan IGN personnalisable</p>\n"}
          }


  export const DEFAULT_CONF =   {
  "name": "ORTHOIMAGERY.ORTHOPHOTOS",
  "title": "Photographies aériennes",
  "description": "<p>Photographies aériennes</p>\n",
  "globalConstraint": {
    "noConstraint": true,
    "maxScaleDenominator": 559082264.0287179,
    "minScaleDenominator": 1066.364791924893,
    "bbox": {
      "left": -180,
      "right": 180,
      "top": 80,
      "bottom": -80
    }
  },
  "serviceParams": {
    "id": "OGC:WMTS",
    "version": "1.0.0",
    "serverUrl": {
      "full": "https://data.geopf.fr/wmts"
    }
  },
  "defaultProjection": "EPSG:3857",
  "wmtsOptions": {
    "tileMatrixSetLink": "PM_0_19",
    "tileMatrixSetLimits": {
      "0": {
        "minTileRow": "0",
        "maxTileRow": "0",
        "minTileCol": "0",
        "maxTileCol": "0"
      },
      "1": {
        "minTileRow": "0",
        "maxTileRow": "1",
        "minTileCol": "0",
        "maxTileCol": "1"
      },
      "2": {
        "minTileRow": "0",
        "maxTileRow": "3",
        "minTileCol": "0",
        "maxTileCol": "4"
      },
      "3": {
        "minTileRow": "0",
        "maxTileRow": "7",
        "minTileCol": "0",
        "maxTileCol": "8"
      },
      "4": {
        "minTileRow": "1",
        "maxTileRow": "14",
        "minTileCol": "0",
        "maxTileCol": "15"
      },
      "5": {
        "minTileRow": "3",
        "maxTileRow": "28",
        "minTileCol": "0",
        "maxTileCol": "31"
      },
      "6": {
        "minTileRow": "7",
        "maxTileRow": "56",
        "minTileCol": "0",
        "maxTileCol": "63"
      },
      "7": {
        "minTileRow": "14",
        "maxTileRow": "113",
        "minTileCol": "0",
        "maxTileCol": "127"
      },
      "8": {
        "minTileRow": "28",
        "maxTileRow": "227",
        "minTileCol": "0",
        "maxTileCol": "255"
      },
      "9": {
        "minTileRow": "57",
        "maxTileRow": "454",
        "minTileCol": "0",
        "maxTileCol": "511"
      },
      "10": {
        "minTileRow": "114",
        "maxTileRow": "909",
        "minTileCol": "0",
        "maxTileCol": "1023"
      },
      "11": {
        "minTileRow": "229",
        "maxTileRow": "1818",
        "minTileCol": "0",
        "maxTileCol": "2047"
      },
      "12": {
        "minTileRow": "459",
        "maxTileRow": "3636",
        "minTileCol": "0",
        "maxTileCol": "4095"
      },
      "13": {
        "minTileRow": "919",
        "maxTileRow": "7272",
        "minTileCol": "0",
        "maxTileCol": "8191"
      },
      "14": {
        "minTileRow": "1839",
        "maxTileRow": "14544",
        "minTileCol": "0",
        "maxTileCol": "16383"
      },
      "15": {
        "minTileRow": "3678",
        "maxTileRow": "29089",
        "minTileCol": "0",
        "maxTileCol": "32767"
      },
      "16": {
        "minTileRow": "7357",
        "maxTileRow": "58178",
        "minTileCol": "0",
        "maxTileCol": "65535"
      },
      "17": {
        "minTileRow": "14714",
        "maxTileRow": "116357",
        "minTileCol": "0",
        "maxTileCol": "131071"
      },
      "18": {
        "minTileRow": "29428",
        "maxTileRow": "232715",
        "minTileCol": "0",
        "maxTileCol": "262143"
      },
      "19": {
        "minTileRow": "58856",
        "maxTileRow": "465431",
        "minTileCol": "0",
        "maxTileCol": "524287"
      }
    }
  },
  "metadata": [
    {
      "url": "https://data.geopf.fr/csw?REQUEST=GetRecordById&SERVICE=CSW&VERSION=2.0.2&OUTPUTSCHEMA=http%3A%2F%2Fwww.isotc211.org%2F2005%2Fgmd&elementSetName=full&ID=IGNF_BD-ORTHO",
      "format": ""
    },
    {
      "url": "https://cartes.gouv.fr/catalogue/dataset/IGNF_BD-ORTHO",
      "format": ""
    }
  ],
  "styles": [
    {
      "name": "normal",
      "title": "Légende générique",
      "current": true,
      "url": null
    }
  ],
  "legends": [
    {
      "format": "image/jpeg",
      "url": "https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg",
      "minScaleDenominator": "200"
    }
  ],
  "formats": [
    {
      "name": "image/jpeg",
      "current": true
    }
  ],
  "thumbnail": "https://data.geopf.fr/annexes/ressources/metadata/thumbnail/vignette-bd-ortho.jpg",
  "producer": [
    "INSTITUT NATIONAL DE L'INFORMATION GEOGRAPHIQUE ET FORESTIERE (IGN)"
  ],
  "thematic": [
    "Carte de référence de la couverture terrestre"
  ],
  "metadata_urls": [
    "https://data.geopf.fr/csw?REQUEST=GetRecordById&SERVICE=CSW&VERSION=2.0.2&OUTPUTSCHEMA=http%3A%2F%2Fwww.isotc211.org%2F2005%2Fgmd&elementSetName=full&ID=IGNF_BD-ORTHO",
    "https://cartes.gouv.fr/catalogue/dataset/IGNF_BD-ORTHO"
  ],
  "base": true,
  "key": "ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS",
  "service": "WMTS",
  "categories": [
    "base",
    80900460,
    548487533
  ],
  "producer_urls": [
    {
      "name": "INSTITUT NATIONAL DE L'INFORMATION GEOGRAPHIQUE ET FORESTIERE (IGN)",
      "url": "https://cartes.gouv.fr/catalogue/search?organization=INSTITUT NATIONAL DE L'INFORMATION GEOGRAPHIQUE ET FORESTIERE (IGN)"
    }
  ],
  "thematic_urls": [
    {
      "name": "Carte de référence de la couverture terrestre",
      "url": "https://cartes.gouv.fr/catalogue/search?topic=imageryBaseMapsEarthCover"
    }
  ],
  "label": "Photographies aériennes",
  "position": -1,
  "opacity": 1,
  "visible": true,
  "grayscale": false,
  "params": {
    "url": "https://data.geopf.fr/wmts",
    "styles": "normal",
    "version": "1.0.0",
    "format": "image/jpeg",
    "projection": "EPSG:3857",
    "minScale": 1066.364791924893,
    "maxScale": 559082264.0287179,
    "extent": {
      "left": -180,
      "right": 180,
      "top": 80,
      "bottom": -80
    },
    "legends": [
      {
        "format": "image/jpeg",
        "url": "https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg",
        "minScaleDenominator": "200"
      }
    ],
    "title": "Photographies aériennes",
    "description": "<p>Photographies aériennes</p>\n",
    "tileMatrixSetLimits": {
      "0": {
        "minTileRow": "0",
        "maxTileRow": "0",
        "minTileCol": "0",
        "maxTileCol": "0"
      },
      "1": {
        "minTileRow": "0",
        "maxTileRow": "1",
        "minTileCol": "0",
        "maxTileCol": "1"
      },
      "2": {
        "minTileRow": "0",
        "maxTileRow": "3",
        "minTileCol": "0",
        "maxTileCol": "4"
      },
      "3": {
        "minTileRow": "0",
        "maxTileRow": "7",
        "minTileCol": "0",
        "maxTileCol": "8"
      },
      "4": {
        "minTileRow": "1",
        "maxTileRow": "14",
        "minTileCol": "0",
        "maxTileCol": "15"
      },
      "5": {
        "minTileRow": "3",
        "maxTileRow": "28",
        "minTileCol": "0",
        "maxTileCol": "31"
      },
      "6": {
        "minTileRow": "7",
        "maxTileRow": "56",
        "minTileCol": "0",
        "maxTileCol": "63"
      },
      "7": {
        "minTileRow": "14",
        "maxTileRow": "113",
        "minTileCol": "0",
        "maxTileCol": "127"
      },
      "8": {
        "minTileRow": "28",
        "maxTileRow": "227",
        "minTileCol": "0",
        "maxTileCol": "255"
      },
      "9": {
        "minTileRow": "57",
        "maxTileRow": "454",
        "minTileCol": "0",
        "maxTileCol": "511"
      },
      "10": {
        "minTileRow": "114",
        "maxTileRow": "909",
        "minTileCol": "0",
        "maxTileCol": "1023"
      },
      "11": {
        "minTileRow": "229",
        "maxTileRow": "1818",
        "minTileCol": "0",
        "maxTileCol": "2047"
      },
      "12": {
        "minTileRow": "459",
        "maxTileRow": "3636",
        "minTileCol": "0",
        "maxTileCol": "4095"
      },
      "13": {
        "minTileRow": "919",
        "maxTileRow": "7272",
        "minTileCol": "0",
        "maxTileCol": "8191"
      },
      "14": {
        "minTileRow": "1839",
        "maxTileRow": "14544",
        "minTileCol": "0",
        "maxTileCol": "16383"
      },
      "15": {
        "minTileRow": "3678",
        "maxTileRow": "29089",
        "minTileCol": "0",
        "maxTileCol": "32767"
      },
      "16": {
        "minTileRow": "7357",
        "maxTileRow": "58178",
        "minTileCol": "0",
        "maxTileCol": "65535"
      },
      "17": {
        "minTileRow": "14714",
        "maxTileRow": "116357",
        "minTileCol": "0",
        "maxTileCol": "131071"
      },
      "18": {
        "minTileRow": "29428",
        "maxTileRow": "232715",
        "minTileCol": "0",
        "maxTileCol": "262143"
      },
      "19": {
        "minTileRow": "58856",
        "maxTileRow": "465431",
        "minTileCol": "0",
        "maxTileCol": "524287"
      }
    },
    "TMSLink": "PM_0_19",
    "matrixIds": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19"
    ],
    "tileMatrices": {
      "0": {
        "matrixId": "0",
        "matrixHeight": 1,
        "matrixWidth": 1,
        "scaleDenominator": 559082264.0287179,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "1": {
        "matrixId": "1",
        "matrixHeight": 2,
        "matrixWidth": 2,
        "scaleDenominator": 279541132.01435894,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "2": {
        "matrixId": "2",
        "matrixHeight": 4,
        "matrixWidth": 4,
        "scaleDenominator": 139770566.0071793,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "3": {
        "matrixId": "3",
        "matrixHeight": 8,
        "matrixWidth": 8,
        "scaleDenominator": 69885283.00358965,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "4": {
        "matrixId": "4",
        "matrixHeight": 16,
        "matrixWidth": 16,
        "scaleDenominator": 34942641.50179486,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "5": {
        "matrixId": "5",
        "matrixHeight": 32,
        "matrixWidth": 32,
        "scaleDenominator": 17471320.75089743,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "6": {
        "matrixId": "6",
        "matrixHeight": 64,
        "matrixWidth": 64,
        "scaleDenominator": 8735660.375448715,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "7": {
        "matrixId": "7",
        "matrixHeight": 128,
        "matrixWidth": 128,
        "scaleDenominator": 4367830.1877243575,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "8": {
        "matrixId": "8",
        "matrixHeight": 256,
        "matrixWidth": 256,
        "scaleDenominator": 2183915.0938621787,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "9": {
        "matrixId": "9",
        "matrixHeight": 512,
        "matrixWidth": 512,
        "scaleDenominator": 1091957.5469310894,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "10": {
        "matrixId": "10",
        "matrixHeight": 1024,
        "matrixWidth": 1024,
        "scaleDenominator": 545978.7734655464,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "11": {
        "matrixId": "11",
        "matrixHeight": 2048,
        "matrixWidth": 2048,
        "scaleDenominator": 272989.38673277217,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "12": {
        "matrixId": "12",
        "matrixHeight": 4096,
        "matrixWidth": 4096,
        "scaleDenominator": 136494.69336638608,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "13": {
        "matrixId": "13",
        "matrixHeight": 8192,
        "matrixWidth": 8192,
        "scaleDenominator": 68247.34668319322,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "14": {
        "matrixId": "14",
        "matrixHeight": 16384,
        "matrixWidth": 16384,
        "scaleDenominator": 34123.673341596535,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "15": {
        "matrixId": "15",
        "matrixHeight": 32768,
        "matrixWidth": 32768,
        "scaleDenominator": 17061.83667079829,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "16": {
        "matrixId": "16",
        "matrixHeight": 65536,
        "matrixWidth": 65536,
        "scaleDenominator": 8530.918335399145,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "17": {
        "matrixId": "17",
        "matrixHeight": 131072,
        "matrixWidth": 131072,
        "scaleDenominator": 4265.459167699572,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "18": {
        "matrixId": "18",
        "matrixHeight": 262144,
        "matrixWidth": 262144,
        "scaleDenominator": 2132.7295838497826,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      },
      "19": {
        "matrixId": "19",
        "matrixHeight": 524288,
        "matrixWidth": 524288,
        "scaleDenominator": 1066.364791924893,
        "tileHeight": 256,
        "tileWidth": 256,
        "topLeftCorner": {
          "x": -20037508.3427892,
          "y": 20037508.3427892
        }
      }
    },
    "nativeResolutions": [
      "156543.0339280410",
      "78271.51696402048",
      "39135.75848201023",
      "19567.87924100512",
      "9783.939620502561",
      "4891.969810251280",
      "2445.984905125640",
      "1222.992452562820",
      "611.4962262814100",
      "305.7481131407048",
      "152.8740565703525",
      "76.43702828517624",
      "38.21851414258813",
      "19.10925707129406",
      "9.554628535647032",
      "4.777314267823516",
      "2.388657133911758",
      "1.194328566955879",
      "0.5971642834779395",
      "0.2985821417389697"
    ]
  }
}