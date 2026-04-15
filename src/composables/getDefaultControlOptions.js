import IconGeolocationSVG from "@/assets/geolocation.svg";

export const layerImportOptions = {
  id: "20",
  position: "top-right",
  gutter: true,
  listable: true,
  layerTypes: ["KML", "GeoJSON"]
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