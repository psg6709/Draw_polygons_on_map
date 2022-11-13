// Directory ref variables
var gv_markerImgDir = "./img/"

// Currently modified marker variables
var gv_markerOrder = 1; // set the order of each marker
var gv_markersGgMp = [];  //current marker list.
var gv_markerInfos = [];  //current markerInfo list.
var gv_markerColorDict = {
        "red": gv_markerImgDir + "marker_red.png",
        "black": gv_markerImgDir + "marker_black.png",
        "blue": gv_markerImgDir + "marker_blue.png",
        "brown": gv_markerImgDir + "marker_brown.png",
        "green": gv_markerImgDir + "marker_green.png",
        "orange": gv_markerImgDir + "marker_orange.png",
        "pink": gv_markerImgDir + "marker_pink.png",
        "purple": gv_markerImgDir + "marker_purple.png",
        "yellow": gv_markerImgDir + "marker_yellow.png",
        "gray": gv_markerImgDir + "marker_gray.png"
}

// Current polygon information variables
var gv_polyIdMaxPlusOne = 1; //the ID of the next polygon
var gv_polyIdCur = 0;  //Current polygon ID
var gv_polygonDict = {};
var gv_drawable = false;
var gv_polyColorDict = {
    "red": {
        paths: [],
        strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#FF0000", fillOpacity: 0.35
    },
    "black": {
        paths: [],
        strokeColor: "#000000", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#000000", fillOpacity: 0.35
    },
    "blue": {
        paths: [],
        strokeColor: "#0000ff", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#0000ff", fillOpacity: 0.35
    },
    "brown": {
        paths: [],
        strokeColor: "#b45c1c", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#b45c1c", fillOpacity: 0.35
    },
    "green": {
        paths: [],
        strokeColor: "#0b6a3c", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#0b6a3c", fillOpacity: 0.35
    },
    "orange": {
        paths: [],
        strokeColor: "#ffa305", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#ffa305", fillOpacity: 0.35
    },
    "pink": {
        paths: [],
        strokeColor: "#ffc7c7", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#ffc7c7", fillOpacity: 0.35
    },
    "purple": {
        paths: [],
        strokeColor: "#ff00ea", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#ff00ea", fillOpacity: 0.35
    },
    "yellow": {
        paths: [],
        strokeColor: "#f2ff00", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#f2ff00", fillOpacity: 0.35
    },
    "gray": {
        paths: [],
        strokeColor: "#bfbfbf", strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: "#bfbfbf", fillOpacity: 0.35
    }

}

//current map varialbe
var gv_map; //google map
var gv_map_ctr_lat = 0; // center latitude when initialized
var gv_map_ctr_lon = 179; // center longitude when initialized
var gv_map_ctr_zl = 3;  // zoom level when initialized

//color variable
var gv_initialColor = "red";
