class c_markerInfo {
    constructor(lat, lon, polyId, order) {        
        this._lat = lat;
        this._lon = lon;
        this._polyId = polyId;
        this._order = order;
    }
}

class c_polygonInfo {
    constructor(color, id, ptNumber){
        this._color = color;
        this._id = id;
        this._markerList = [];
        this._ptNumber = ptNumber;
        this._show = true;
    }
}
