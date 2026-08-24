import IconGeolocationSVG from "@/assets/geolocation.svg";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import mapPinIcon from "@/assets/map-pin-2-fill.svg";

export const layerImportOptions = {
  id: "20",
  position: "top-right",
  gutter: true,
  listable: true,
  layerTypes: ["GeoJSON", "KML"],
  vectorStyleOptions : {
    "GeoJSON" : {
        extractStyles : true,
        defaultStyle : new Style({
        image : new Icon({
            src : mapPinIcon,
            color : "#000091",
            anchor : [0.5, 1],
        }),
        stroke : new Stroke({
            color : "#000091",
            lineDash : [5,  5],
            width : 2,
            lineDashOffset : 0
        }),
        fill : new Fill({
            color : "rgba(1, 1, 1, 0.3)",
        }),
    })
    },
    "KML" : {
        extractStyles : false,
        defaultStyle : new Style({
        image : new Icon({
            src : mapPinIcon,
            color : "#000091",
            anchor : [0.5, 1],
        }),
        stroke : new Stroke({
            color : "#000091",
            lineDash : [5,  5],
            width : 2,
            lineDashOffset : 0
        }),
        fill : new Fill({
            color : "rgba(1, 1, 1, 0.3)",
        }),
    })
    }
  }
};
export const drawingOptions = {
  id: "3",
  position: "top-right",
  gutter: false,
  tools : {
    "export" : false
  }
}
export const searchEngineOptions = {
  id: "1",
  collapsed: false,
  collapsible: false,
  returnTrueGeometry: true,
  autocompleteOptions : {
    serviceOptions : {
        maximumResponses : 10
    },
    prettifyResults : true,
    maximumEntries : 5
  },
  markerUrl : IconGeolocationSVG,
  placeholder: "Rechercher un lieu...",

};
export const zoomOptions = {
  position: "bottom-right",
  id: "9",
};