"use strict";

function f_initMap() {  
    // Initialize the google map API.
    const mapbase = {  
        center: new google.maps.LatLng(gv_map_ctr_lat, gv_map_ctr_lon),  
        zoom: gv_map_ctr_zl,  
        mapTypeId: google.maps.MapTypeId.roadmap  
    }  

    gv_map = new google.maps.Map(document.getElementById("div2_map"), mapbase);  

    // Put the marine traffic density maps on the google map.
    var marineTrafficUrl = 'https://tiles3.marinetraffic.com/densitymaps2017/density_tiles2017/{z}/{x}/{y}.png';
    var layer;
    var layerID = 'Density map';

    layer = new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = marineTrafficUrl
            .replace('{x}', coord.x)
            .replace('{y}', coord.y)
            .replace('{z}', zoom);
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
    });
    layer.setOpacity(0.7);

    gv_map.mapTypes.set(layerID, layer);   // Apply the new tile layer to the map.
    gv_map.overlayMapTypes.push(layer);

    // Draw polygons if there are.
    if (Object.keys(gv_polygonDict).length > 0) {
        f_drawPolygons();
    }
}

function f_initMapWithCoordi(panLat, panLon) {  
    // Initialize the google map API.
    const mapbase = {  
        center: new google.maps.LatLng(panLat, panLon),  
        zoom: 5,  
        mapTypeId: google.maps.MapTypeId.roadmap  
    }  

    gv_map = new google.maps.Map(document.getElementById("div2_map"), mapbase);  

    // Put the marine traffic density maps on the google map.
    var marineTrafficUrl = 'https://tiles3.marinetraffic.com/densitymaps2017/density_tiles2017/{z}/{x}/{y}.png';
    var layer;
    var layerID = 'Density map';

    layer = new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = marineTrafficUrl
            .replace('{x}', coord.x)
            .replace('{y}', coord.y)
            .replace('{z}', zoom);
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
    });
    layer.setOpacity(0.7);

    gv_map.mapTypes.set(layerID, layer);   // Apply the new tile layer to the map.
    gv_map.overlayMapTypes.push(layer);

    // Draw polygons if there are.
    if (Object.keys(gv_polygonDict).length > 0) {
        f_drawPolygons();
    }
}

function f_initMapPutMarkers(tmpPolyId_in) { 
    // Confirm the data type of polygon ID
    var tmpPolyId = tmpPolyId_in.toString();

    // Initialize the google map api  
    const mapbase = {  
        center: new google.maps.LatLng(gv_map_ctr_lat, gv_map_ctr_lon),  
        zoom: gv_map_ctr_zl,  
        mapTypeId: google.maps.MapTypeId.roadmap  
    }  
    gv_map = new google.maps.Map(document.getElementById("div2_map"), mapbase);  

    gv_map.addListener("click", (e) => {        // marker can be checked
        f_putMarker(e.latLng);
    });
    
    // put markers if any.    
    gv_polyIdCur = tmpPolyId;
    const polyIdConst = tmpPolyId;
    if (gv_markerInfos.length > 0){
        gv_markerInfos = f_iterationCopyArrMkInfo(gv_polygonDict[polyIdConst]._markerList);

        var polyColor = gv_polygonDict[polyIdConst]._color;
        gv_markersGgMp = [];
        gv_markerOrder = 0;
    
        for (var i = 0; i < gv_markerInfos.length; i++){
            gv_markerOrder++;
            const tmpMarkerOrder = gv_markerOrder;
            gv_markerInfos[i]._order = tmpMarkerOrder;
            const lat = parseFloat(gv_markerInfos[i]._lat);
            const lon = parseFloat(gv_markerInfos[i]._lon);
            var latLon = new google.maps.LatLng(lat, lon);

            // set marker 
            var markerSet = {
                position: latLon,
                map: gv_map,
                label: {
                    text: polyIdConst + "-" + tmpMarkerOrder,
                    color: "#000",
                    fontSize: "14px"
                },
                icon: gv_markerColorDict[polyColor]
            };
            const tmpMarker = new google.maps.Marker(markerSet);   
            tmpMarker._order = tmpMarkerOrder;
            gv_markersGgMp.push(tmpMarker);

            // set the marker window
            var content = f_markerWindow(lat, lon, polyIdConst, tmpMarkerOrder, polyColor, false);
            const infoWindow = new google.maps.InfoWindow({content: content});

            google.maps.event.addListener(tmpMarker, "click", ()=>{
                infoWindow.open({
                    anchor: tmpMarker,
                    gv_map,
                    shouldFocus: false
                });
            });
        }
        gv_markerOrder++;
    }
    
    // set marine traffic density maps
    var marineTrafficUrl = 'https://tiles3.marinetraffic.com/densitymaps2017/density_tiles2017/{z}/{x}/{y}.png';
    var layer;
    var layerID = 'Density map';

    layer = new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = marineTrafficUrl
            .replace('{x}', coord.x)
            .replace('{y}', coord.y)
            .replace('{z}', zoom);
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
    });
    layer.setOpacity(0.7);

    gv_map.mapTypes.set(layerID, layer);    // Apply the new tile layer to the map.
    gv_map.overlayMapTypes.push(layer);
    
    // draw polygons if any.
    if (Object.keys(gv_polygonDict).length > 0) {
        f_drawPolygons();
    }
}  

function f_putMarker(latLon){
    const latDg = latLon.lat().toFixed(4);
    const lonDg = latLon.lng().toFixed(4);

    var markerInfo = new c_markerInfo(latDg, lonDg, gv_polyIdCur, gv_markerOrder);
    var marker = new google.maps.Marker({
        position: latLon,
        map: gv_map,
        label: {
            text: markerInfo._polyId + "-" + markerInfo._order,
            color: "#000",
            fontSize: "14px"
        },
        icon: "./img/marker_" + gv_initialColor + ".png"
    });    

    google.maps.event.addListener(marker, "click", function(e) {
        var content = f_markerWindow(markerInfo._lat, markerInfo._lon, gv_polyIdCur, markerInfo._order, gv_initialColor, true);
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        infoWindow.open(gv_map, marker);
    });
    marker._order = markerInfo._order;

    gv_markersGgMp.push(marker);
    gv_markerInfos.push(markerInfo);
    gv_markerOrder++;
}

function f_deleteMarker(markerOrder){
    // Find and delete the marker
    for (var i = 0; i < gv_markersGgMp.length; i++){
        if (gv_markersGgMp[i]._order == markerOrder){
            // Remove the marker from Map
            gv_markersGgMp[i].setMap(null);

            // Delete the marker from array
            gv_markersGgMp.splice(i, 1);
            gv_markerInfos.splice(i, 1);

            // Update the marker order
            f_updateGvMarkerOrder();
            return;
        }
    }
}

function f_updateGvMarkerOrder(){
    for (var i = 0; i < gv_markersGgMp.length; i++){
        gv_markersGgMp[i]._order = i+1
    }
}

function f_drawPolygons(){
    for (let key in gv_polygonDict){
        const tmpPolygon = gv_polygonDict[key];
        var polygonVtx = [];
        var polyColor = tmpPolygon._color;

        if (!tmpPolygon._show){
            continue;
        }

        for (var j = 0; j < tmpPolygon._markerList.length; j++){
            var lat = parseFloat(tmpPolygon._markerList[j]._lat)
            var lon = parseFloat(tmpPolygon._markerList[j]._lon)
            polygonVtx.push({lat: lat, lng: lon});
        }

        gv_polyColorDict[polyColor].paths = polygonVtx;
        
        // Construct the polygon.
        const polygonMethod = new google.maps.Polygon(gv_polyColorDict[polyColor]);

        // Initialize the container
        gv_polyColorDict[polyColor].paths = [];
        
        polygonMethod.setMap(gv_map);
    }
}

function f_addPolygonBox1(){
    //remove the xml box
    var xmlElement = document.querySelector(".div3_2_xml_box");
    xmlElement.remove();

    // remove the download polygon xml button
    var downloadPolygonElement = document.querySelector(".div3_2_download_btn");
    downloadPolygonElement.remove();

    //create polybox1
    var poly_box1 = document.createElement("div");
    poly_box1.className = "div3_2_polybox1";
    poly_box1.id = "polybox1_" + gv_polyIdMaxPlusOne.toString();
    poly_box1.style = "width: 60%; height: 60px; padding: 10px; border-width: 1.5px; border-color: black; border-style: solid; margin-top: 10px";
    var str = `<p style="margin:0pt; color:black; font-family: Arial, sans-serif; font-size: 20px;">Polygon ${gv_polyIdMaxPlusOne.toString()}</p>
    <button id="${poly_box1.id}__${gv_polyIdMaxPlusOne.toString()}__start" style="margin-top:15px;" type="button" onclick="f_startDrawPolygon(this.id)">Start Draw</button>
    <button id="${poly_box1.id}__${gv_polyIdMaxPlusOne.toString()}__drop" style="margin-top:15px;" type="button" onclick="f_dropDrawPolygon()" disabled>Drop Draw</button>
    <button id="${poly_box1.id}__${gv_polyIdMaxPlusOne.toString()}__complete" style="margin-top:15px;" type="button" onclick="f_completeDrawPolygon(this.id)" disabled>Complete Draw</button>`
    poly_box1.innerHTML = str;
    var poly_div3_2 = document.querySelector("#div3_2");
    poly_div3_2.appendChild(poly_box1);
    poly_div3_2.appendChild(xmlElement);
    poly_div3_2.appendChild(downloadPolygonElement);

    // update the global polygon variables
    gv_polyIdMaxPlusOne++; 
}

function f_addPolygonBox1FromXml(){
    //remove the xml box
    var xmlElement = document.querySelector(".div3_2_xml_box");
    xmlElement.remove();

    // remove the download polygon xml button
    var downloadPolygonElement = document.querySelector(".div3_2_download_btn");
    downloadPolygonElement.remove();

    //create polybox1
    var poly_box1 = document.createElement("div");
    poly_box1.className = "div3_2_polybox1";
    poly_box1.id = "polybox1_" + gv_polyIdCur;
    poly_box1.style = "width: 60%; height: 60px; padding: 10px; border-width: 1.5px; border-color: black; border-style: solid; margin-top: 10px";
    var str = `<p style="margin:0pt; color:black; font-family: Arial, sans-serif; font-size: 20px;">Polygon ${gv_polyIdCur}</p>
    <button id="${poly_box1.id}__${gv_polyIdCur}__start" style="margin-top:15px;" type="button" onclick="f_startDrawPolygon(this.id)">Start Draw</button>
    <button id="${poly_box1.id}__${gv_polyIdCur}__drop" style="margin-top:15px;" type="button" onclick="f_dropDrawPolygon()" disabled>Drop Draw</button>
    <button id="${poly_box1.id}__${gv_polyIdCur}__complete" style="margin-top:15px;" type="button" onclick="f_completeDrawPolygon(this.id)" disabled>Complete Draw</button>`
    poly_box1.innerHTML = str;
    var poly_div3_2 = document.querySelector("#div3_2");
    poly_div3_2.appendChild(poly_box1);
    poly_div3_2.appendChild(xmlElement);
    poly_div3_2.appendChild(downloadPolygonElement);

    // update the global polygon variables
    gv_polyIdMaxPlusOne++; 
}

function f_dropDrawPolygon(){
    let confirmAction = confirm("Are you sure to drop the markers?");
    if (!confirmAction){
        return;
    }

    // Initialize the marker global marker variables
    f_initGvMarkerVariables();

    // Initialize button status.
    f_activateEveryButtons();
    f_activateButtonPlus();

    // Inactivate buttons.
    f_disableEveryDropCompleteDraw();

    // Initialize the map.
    f_initMap();
}

function f_initGvMarkerVariables(){
    gv_markerOrder = 1;   //marker order.
    gv_markersGgMp = [];  //marker list.
    gv_markerInfos = [];  //markerInfo list.
}

function f_disableButtonPlus(){
    var buttonPlusElmt = document.getElementById("button_plus");
    buttonPlusElmt.removeAttribute("onclick");      
    buttonPlusElmt.className = "button_plus_disabled";
}

function f_activateButtonPlus(){
    var buttonPlusElmt = document.getElementById("button_plus");
    buttonPlusElmt.setAttribute("onclick", "f_addPolygonBox1()");    
    buttonPlusElmt.className = "button_plus";
}

function f_startDrawPolygon(btnId){
    // Initialize the marker global variables
    f_initGvMarkerVariables();

    // Initialize the current polygon information.
    const idArr = btnId.split("__");
    gv_polyIdCur = idArr[1];
    
    // Inactivate buttons.
    f_disableEveryButtons();
    f_disableButtonPlus();

    // Activate Drop Draw and Complete Draw buttons
    let idDrop = idArr[0] + "__" + gv_polyIdCur + "__drop";
    let idComplete = idArr[0] + "__" + gv_polyIdCur +"__complete";
    document.getElementById(idDrop).disabled = false;
    document.getElementById(idComplete).disabled = false;

    // Initialize the map.
    f_initMapPutMarkers(gv_polyIdCur);
}

function f_disableEveryButtons(){
    var buttonList = document.getElementsByTagName('button');
    for (let i = 0; i < buttonList.length; i++) {
        let button = buttonList[i];
        button.disabled = true;
    }
}

function f_disableEveryDropCompleteDraw(){
    const allElementDrops = document.querySelectorAll('[id$="__drop"]');
    for (var i = 0; i < allElementDrops.length; i++){
        allElementDrops[i].disabled = true;
    }

    const allElementCompletes = document.querySelectorAll('[id$="__complete"]');
    for (var i = 0; i < allElementCompletes.length; i++){
        allElementCompletes[i].disabled = true;
    }    
}

function f_activateEveryButtons(){
    var buttonList = document.getElementsByTagName('button');
    for (let i = 0; i < buttonList.length; i++) {
        let button = buttonList[i];
        button.disabled = false;
    }
}

function f_activateEveryStartDrawButtons(){
    var buttonList = document.getElementsByTagName('button');
    for (let i = 0; i < buttonList.length; i++) {
        let buttonId = buttonList[i].id;
        var btnType = buttonId.split("__")[-1];
        if (btnType == "start"){
            buttonList[i].disabled = false;
        }        
    }
}

function f_completeDrawPolygon(btnId){
    // check it has enough markers
    f_checkDrawable();
    if (!gv_drawable){
        alert("Not enough markers.\nPlease put three or more of them.");
        return;
    }

    // set polygon data
    gv_polyIdCur = btnId.split("__")[1];
    var tmpPolygon = new c_polygonInfo(gv_initialColor, gv_polyIdCur, gv_markersGgMp.length);
    tmpPolygon._markerList = gv_markerInfos;
    tmpPolygon._ptNumber = gv_markerInfos.length;
    gv_polygonDict[gv_polyIdCur.toString()] = tmpPolygon;

    var polyBox1Id = "polybox1_" + gv_polyIdCur.toString();
    var polyBox2Id = "polybox2_" + gv_polyIdCur.toString();
    var polyBox2 = document.getElementById(polyBox1Id);
    polyBox2.id = polyBox2Id;
    polyBox2.className = "div3_2_polybox2";
    polyBox2.style = "width: 60%; height: 140px; padding: 10px; border-width: 1.5px; border-color: black; border-style: solid; margin-top: 10px";
    var str = `<p style="margin:0pt; color:black; font-family: Arial, sans-serif; font-size: 20px;">Polygon ${tmpPolygon._id.toString()}</p>
    <label style="margin-top:15px; float:left;"><input id="${polyBox2.id}__${gv_polyIdCur.toString()}__show" type="checkbox" onclick="f_showHidePolygon(this.id)">Show Polygon&nbsp;&nbsp;</label>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__pan" style="margin-top:15px;" type="button" onclick="f_panToPolygon(this.id)">Pan to Polygon</button>
    </br></br>
    <select id="${polyBox2.id}__${gv_polyIdCur.toString()}__colorDropDown">
        <option value="black">Black</option>
        <option value="blue">Blue</option>
        <option value="brown">Brown</option>
        <option value="green">Green</option>
        <option value="orange">Orange</option>
        <option value="pink">Pink</option>
        <option value="purple">Purple</option>
        <option value="red">Red</option>
        <option value="yellow">Yellow</option>
        <option value="gray">Gray</option>
    </select>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__color" style="margin-top:3px;" type="button" onclick="f_setColorPolygon(this.id)">Set Color</button>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__edit" style="margin-top:3px;" type="button" onclick="f_editPolygon(this.id)">Edit Vertices</button>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__coordi" style="margin-top:15px;" type="button" onclick="f_showCoordiPolygon(this.id)">Show Coordi.</button>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__delete" style="margin-top:15px; clear:left" type="button" onclick="f_deletePolygon(this.id)">Delete Polygon</button>`
    polyBox2.innerHTML = str;
    document.getElementById(polyBox2.id + "__" + gv_polyIdCur.toString() + "__colorDropDown").value = gv_initialColor;
    
    var showHideCheck = document.getElementById(`${polyBox2.id}__${gv_polyIdCur.toString()}__show`);
    if (tmpPolygon._show){
        showHideCheck.checked = true;
    } else {
        showHideCheck.checked = false;
    }

    // Initialize button status.
    f_activateEveryButtons();
    f_activateButtonPlus();

    // Inactivate buttons.
    f_disableEveryDropCompleteDraw();

    // export polygon data to global marker variables.
    // Initialize the map.
    var polygonCenter = f_calPolygonCenter()
    var latAvg = polygonCenter[0];
    var lonAvg = polygonCenter[1];
    f_initMapWithCoordi(latAvg, lonAvg);

}

function f_completeDrawPolygonFromXml(btnId, color){
    // check it has enough markers
    f_checkDrawable();
    if (!gv_drawable){
        alert("Not enough markers.\nPlease put three or more of them.");
        return;
    }

    // set polygon data
    gv_polyIdCur = btnId.split("__")[1];
    var tmpPolygon = new c_polygonInfo(color, gv_polyIdCur, gv_markersGgMp.length);
    tmpPolygon._markerList = gv_markerInfos;
    tmpPolygon._ptNumber = gv_markerInfos.length;
    gv_polygonDict[gv_polyIdCur.toString()] = tmpPolygon;

    var polyBox1Id = "polybox1_" + gv_polyIdCur.toString();
    var polyBox2Id = "polybox2_" + gv_polyIdCur.toString();
    var polyBox2 = document.getElementById(polyBox1Id);
    polyBox2.id = polyBox2Id;
    polyBox2.className = "div3_2_polybox2";
    polyBox2.style = "width: 60%; height: 140px; padding: 10px; border-width: 1.5px; border-color: black; border-style: solid; margin-top: 10px";
    var str = `<p style="margin:0pt; color:black; font-family: Arial, sans-serif; font-size: 20px;">Polygon ${tmpPolygon._id.toString()}</p>
    <label style="margin-top:15px; float:left;"><input id="${polyBox2.id}__${gv_polyIdCur.toString()}__show" type="checkbox" onclick="f_showHidePolygon(this.id)">Show Polygon</label>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__pan" style="margin-top:15px;" type="button" onclick="f_panToPolygon(this.id)">Pan to Polygon</button>
    </br></br>
    <select id="${polyBox2.id}__${gv_polyIdCur.toString()}__colorDropDown">
        <option value="black">Black</option>
        <option value="blue">Blue</option>
        <option value="brown">Brown</option>
        <option value="green">Green</option>
        <option value="orange">Orange</option>
        <option value="pink">Pink</option>
        <option value="purple">Purple</option>
        <option value="red">Red</option>
        <option value="yellow">Yellow</option>
        <option value="gray">Gray</option>
    </select>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__color" style="margin-top:15px;" type="button" onclick="f_setColorPolygon(this.id)">Set Color</button>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__edit" style="margin-top:15px;" type="button" onclick="f_editPolygon(this.id)">Edit Vertices</button>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__coordi" style="margin-top:15px;" type="button" onclick="f_showCoordiPolygon(this.id)">Show Coordi.</button>
    <button id="${polyBox2.id}__${gv_polyIdCur.toString()}__delete" style="margin-top:15px; clear:left" type="button" onclick="f_deletePolygon(this.id)">Delete Polygon</button>`
    polyBox2.innerHTML = str;
    document.getElementById(polyBox2.id + "__" + gv_polyIdCur.toString() + "__colorDropDown").value = color;
    
    var showHideCheck = document.getElementById(`${polyBox2.id}__${gv_polyIdCur.toString()}__show`);
    if (tmpPolygon._show){
        showHideCheck.checked = true;
    } else {
        showHideCheck.checked = false;
    }

    // Initialize button status.
    f_activateEveryButtons();
    f_activateButtonPlus();

    // Inactivate buttons.
    f_disableEveryDropCompleteDraw();

    // Initialize the map.
    f_initMap();
}

function f_checkDrawable(){
    if (gv_markersGgMp.length < 3){
        gv_drawable = false;
        return;
    }     
    gv_drawable = true;
}

function f_showHidePolygon(checkboxId){
    // set polygon data
    gv_polyIdCur = checkboxId.split("__")[1];

    var showHideCheckElmt = document.getElementById(checkboxId);
    if (showHideCheckElmt.checked){
        gv_polygonDict[gv_polyIdCur]._show = true;
    } else {
        gv_polygonDict[gv_polyIdCur]._show = false;
    }

    // Initialize the map.
    f_initMap();
}

function f_setColorPolygon(btnId){
    // set polygon ID data
    var idArr = btnId.split("__");
    var gv_polyIdCur = idArr[1];
    var idDropDown = idArr[0] + "__" + idArr[1] + "__" + "colorDropDown";
    var polyColor = document.getElementById(idDropDown).value;
    gv_polygonDict[gv_polyIdCur]._color = polyColor;

    // export polygon data to global marker variables.
    // Initialize the map.
    var polygonCenter = f_calPolygonCenter()
    var latAvg = polygonCenter[0];
    var lonAvg = polygonCenter[1];
    f_initMapWithCoordi(latAvg, lonAvg);
}

function f_deletePolygon(btnId){
    let confirmAction = confirm("Are you sure to delete the polygon data?");
    if (!confirmAction){
        return;
    }
    
    // set polygon ID data
    var poly_div3_2 = document.querySelector("#div3_2");
    var idArr = btnId.split("__");
    var polyIdCur = idArr[1];
    delete gv_polygonDict[polyIdCur];
    var polyBox2Id = "polybox2_" + polyIdCur.toString();
    var polyBox = document.getElementById(polyBox2Id);
    poly_div3_2.removeChild(polyBox);

    // Initialize the map.
    f_initMap(); 
}

function f_showCoordiPolygon(btnId){
    // get polygon ID
    var idArr = btnId.split("__");
    var polyIdCur = idArr[1];

    var coordiSpace = document.querySelector("#div4");
    var str = `<p>Polygon ${polyIdCur} vertices</p>`
    str += "<p>"
    var markerList = gv_polygonDict[polyIdCur]._markerList;
    for (var i = 0; i < markerList.length; i++){
        str += "["
        str += markerList[i]._lat
        str += ", "
        str += markerList[i]._lon
        str += "]"

        if (i == markerList.length - 1){
            continue;
        } else {
            str += ", "
        }
    }
    str += "</p>";

    coordiSpace.innerHTML = str;
}

function f_editPolygon(btnId){
    // Inactivate buttons.
    f_disableEveryButtons();
    f_disableButtonPlus();

    // set current polygon
    const idArr = btnId.split("__");
    gv_polyIdCur = idArr[1];

    // change button
    var btnElmt = document.getElementById(btnId);
    btnElmt.setAttribute("onclick", "f_finishEditPolygon(this.id)");    
    btnElmt.innerText = "Finish Edit";
    btnElmt.disabled = false;

    // export polygon data to global marker variables.
    // Initialize the map.
    var polygonCenter = f_calPolygonCenter()
    var latAvg = polygonCenter[0];
    var lonAvg = polygonCenter[1];
    f_initMapWithCoordi(latAvg, lonAvg);
    f_initMapPutMarkersWithCoordi(gv_polyIdCur, latAvg, lonAvg);
}

function f_finishEditPolygon(btnId){
    f_checkDrawable();
    if (!gv_drawable){
        alert("Not enough markers.\nPlease put three or more of them.");
        return;
    }

    // copy current markers to the polygon object.
    const idArr = btnId.split("__");
    gv_polyIdCur = idArr[1];
    
    f_copyCurrentMarker(gv_polyIdCur);
    f_updatePtNumber(gv_polyIdCur);

    var btnElmt = document.getElementById(btnId);
    btnElmt.setAttribute("onclick", "f_editPolygon(this.id)");    
    btnElmt.innerText = "Edit Vertices";

    // Initialize button status.
    f_activateEveryButtons();
    f_activateButtonPlus();

    // Inactivate buttons.
    f_disableEveryDropCompleteDraw();

    // Activate start draw button
    f_activateEveryStartDrawButtons();

    // Initialize google map.
    f_panToPolygon(btnId);
}

function f_downloadPolygonXml(){
    // create document object
    var polyDoc = document.implementation.createDocument("", "", null);
    
    // get polygon data
    var polygonsElem = polyDoc.createElement("polygons");
    for (const [polyId, polygonValue] of Object.entries(gv_polygonDict)){
        var polygonElem = polyDoc.createElement("polygon");
        polygonElem.setAttribute("id", polyId);
        polygonElem.setAttribute("color", polygonValue._color);
        
        var markerList = polygonValue._markerList;
        var str = "";
        for (var i = 0; i < markerList.length; i++){
            str += "["
            str += markerList[i]._lat
            str += ", "
            str += markerList[i]._lon
            str += "]"

            if (i == markerList.length - 1){
                continue;
            } else {
                str += ", "
            }
        }
        polygonElem.innerHTML = str;
        polygonsElem.appendChild(polygonElem);
    }
    polyDoc.appendChild(polygonsElem);

    // Serialize the document.
    var s = new XMLSerializer();
    var xmltext = s.serializeToString(polyDoc);
    
    // Set file download attributes.
    var filename = "polygon_data.xml";
    var pom = document.createElement('a');
    var bb = new Blob([xmltext], {type: 'text/plain'});
    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);
    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true; 
    pom.classList.add('dragout');
    pom.click();
}

function f_markerWindow(lat, lon, winPolygonId, winMarkerOrder, color, initial){
    if (initial){
        var content = "Lat: " + lat + "<br/>Lon: " + lon
        + "<br/>Polygon ID: " + winPolygonId
        + "<br/>Marker Order: " + winMarkerOrder + "th"
        + "<br/>Color: " + color
        + "<br/><br/><input type='button' value='Delete' style='width:58px' onclick='f_deleteMarker(" + winMarkerOrder + ")'>";
        return content;
    }

    var content = "Lat: " + lat + "<br/>Lon: " + lon
    + "<br/>Polygon ID: " + winPolygonId
    + "<br/>Marker Order: " + winMarkerOrder + "th"
    + "<br/>Color: " + color;
    content += "<br/><br/><input type='text' id='newPolygonIdText__" + winPolygonId + "__" + winMarkerOrder + "' style='width:50px;'>" + "&nbsp;&nbsp;&nbsp;" + "<input type='button' value='Change Polygon ID' onclick='f_changePolygonId(" + `"${winPolygonId}"` + ", " + `"${winMarkerOrder}"` + ")'>";
    
    // set marker order drop down menu
    content += `<br/><br/><select id="markerOrderDropDown__${winMarkerOrder}" style='width:58px;'>`;

    // get marker number
    for (var i = 0; i < gv_markerInfos.length; i++) {
        if (i == winMarkerOrder - 1 ){
            content += `<option value="${i+1}" selected="selected">${i+1}</option>`
        } else {
            content += `<option value="${i+1}">${i+1}</option>`
        }        
    }

    content += `</select>` + "&nbsp;&nbsp;&nbsp;";
    content += "<input type='button' value='Set Polygon Order' onclick='f_setMarkerOrder(" + winMarkerOrder + ")'>";
    content += "<br/><br/><input type='button' value='Delete' style='width:58px' onclick='f_deleteMarker(" + winMarkerOrder + ")'>";
    return content;
}

function f_checkSamePolygonId(newPolygonId){
    for (const [polyId, polygonValue] of Object.entries(gv_polygonDict)){
        if (polyId == newPolygonId){
            alert("There is a same ID.\nPlease set another polygon ID.");
            gv_drawable = false;
            return;
        }
    }
}

function f_changePolygonId(oldPolygonId, MarkerOrder){
    const newPolygonId = document.getElementById("newPolygonIdText__" + oldPolygonId + "__" + MarkerOrder).value;
    f_checkSamePolygonId(newPolygonId);
    if (! gv_drawable){
        return;
    }
    if (newPolygonId.toString() == ""){
        alert("Please fill a proper polygon ID");
        return;
    }
    if (!isNaN(newPolygonId.toString()[0])){
        alert("Please let the polygon ID start not with an integer.");
        return;
    }

    // change global variables
    gv_polyIdCur = newPolygonId;
    gv_polygonDict[newPolygonId] = gv_polygonDict[oldPolygonId];
    delete gv_polygonDict[oldPolygonId];
    gv_polygonDict[newPolygonId]._id = newPolygonId;

    for (var i = 0; i < gv_polygonDict[newPolygonId]._markerList.length; i++){
        gv_polygonDict[newPolygonId]._markerList[i]._polyId = newPolygonId;
    }

    // change id in poly box 2
    f_changePolyBox2Id(oldPolygonId, newPolygonId);

    // Initialize google map.
    f_initMapPutMarkers(newPolygonId);
}

function f_changePolyBox2Id(oldPolygonId, newPolygonId){
    // change HTML element id
    var oldPolyBox2Id = "polybox2_" + oldPolygonId
    var newPolyBox2Id = "polybox2_" + newPolygonId
    document.getElementById(oldPolyBox2Id).id = newPolyBox2Id;
    document.getElementById(newPolyBox2Id).getElementsByTagName("p")[0].innerHTML = "Polygon " + newPolygonId;
    document.getElementById(`${oldPolyBox2Id}__${oldPolygonId}__show`).id = `${newPolyBox2Id}__${newPolygonId}__show`;
    document.getElementById(`${oldPolyBox2Id}__${oldPolygonId}__colorDropDown`).id = `${newPolyBox2Id}__${newPolygonId}__colorDropDown`;
    document.getElementById(`${oldPolyBox2Id}__${oldPolygonId}__color`).id = `${newPolyBox2Id}__${newPolygonId}__color`;
    document.getElementById(`${oldPolyBox2Id}__${oldPolygonId}__edit`).id = `${newPolyBox2Id}__${newPolygonId}__edit`;
    document.getElementById(`${oldPolyBox2Id}__${oldPolygonId}__coordi`).id = `${newPolyBox2Id}__${newPolygonId}__coordi`;
    document.getElementById(`${oldPolyBox2Id}__${oldPolygonId}__delete`).id = `${newPolyBox2Id}__${newPolygonId}__delete`;
}

function f_copyCurrentMarker(polygonId){
    gv_polygonDict[polygonId]._markerList = JSON.parse(JSON.stringify(gv_markerInfos));
}

function f_updatePtNumber(polygonId){
    gv_polygonDict[polygonId]._ptNumber = gv_polygonDict[polygonId]._markerList.length;
}

function f_setMarkerOrder(oldMarkerOrder){
    var elemId = `markerOrderDropDown__${oldMarkerOrder}`;
    var newMarkerOrder = parseInt(document.getElementById(elemId).value);
    const targetMarkerData = gv_markerInfos[oldMarkerOrder - 1];

    const tmpMarkerInfo = f_deleteItemInArrByOrder(gv_markerInfos, oldMarkerOrder);
    gv_markerInfos = f_iterationCopyArrMkInfo(tmpMarkerInfo);
    gv_markerInfos.splice(newMarkerOrder - 1, 0, targetMarkerData);

    // set _order of each marker
    for (var i = 0; i < gv_markerInfos.length; i++){
        gv_markerInfos[i]._order = i + 1;
    }

    gv_polygonDict[gv_polyIdCur]._markerList = JSON.parse(JSON.stringify(gv_markerInfos));
    f_initMapPutMarkers(gv_polyIdCur);    
}

function f_deleteItemInArrByOrder(arr, order){
    for( var i = 0; i < arr.length; i++){ 
        if ( i == order - 1) { 
            arr.splice(i, 1); 
            break; 
        }
    }
    return arr;
}

function f_iterationCopyArrMkInfo(arr) {
    let target = [];
    for (var i = 0; i < arr.length; i++){
        var lat = arr[i]._lat;
        var lon = arr[i]._lon;
        var polyId = arr[i]._polyId;
        var order = arr[i]._order;
        var tmpMarkerInfo = new c_markerInfo(lat, lon, polyId, order);
        target.push(tmpMarkerInfo);
    }
    return target;
}

function f_parseXml(str){
    var xmlElm = new DOMParser().parseFromString(str, "application/xml");

    // Check if the div3_2_xml_box is in normal state. 
    try{
        document.getElementsByClassName("div3_2_xml_box_hover")[0].className = "div3_2_xml_box";
        document.getElementsByClassName("drop_box_p_hover")[0].className = "drop_box_p";
    } catch (error){}

    // Get present polygon IDs
    var polygonIds = [];
    for (var id in gv_polygonDict) {
      if (gv_polygonDict.hasOwnProperty(id)) {
        polygonIds.push(id);
      }
    }

    // Check redundant polygon ID
    var tmpElementList = xmlElm.querySelectorAll('*[id]');
    for(var i = 0; i < tmpElementList.length; i++){
        var tmpId = tmpElementList[i].id;
        if (polygonIds.includes(tmpId)){
            alert("The polygon ID " + tmpId + " is redundant.\nPlease change the ID.")
            return;
        }
    }

    // Get the polygon data
    for(var i = 0; i < tmpElementList.length; i++){
        f_initGvMarkerVariables();
        gv_polyIdCur = tmpElementList[i].id;
        const tmpColor = tmpElementList[i].getAttribute("color");
        const tmpCoordi = tmpElementList[i].innerHTML;
        const tmpCoordiArr = tmpCoordi.split("[");

        for(var j = 0; j < tmpCoordiArr.length; j++){
            if(tmpCoordiArr[j] == ""){
                continue;
            }
            const tmpLatLon = tmpCoordiArr[j].split(",");
            const tmpLat = tmpLatLon[0].replace(/[^\d.-]/g, '');
            const tmpLon = tmpLatLon[1].replace(/[^\d.-]/g, '');
            const markerInfo = new c_markerInfo(tmpLat, tmpLon, gv_polyIdCur, 0);
            gv_markerInfos.push(markerInfo);
        }

        // set _order of each marker
        for (var j = 0; j < gv_markerInfos.length; j++){
            gv_markerInfos[j]._order = j + 1;
        }

        // put the polygon information to gv_polygonDict
        var tmpPolygon = new c_polygonInfo(tmpColor, gv_polyIdCur, gv_markerInfos.length);
        tmpPolygon._markerList = gv_markerInfos;
        tmpPolygon._ptNumber = gv_markerInfos.length;
        gv_polygonDict[gv_polyIdCur.toString()] = tmpPolygon;

        
        f_addPolygonBox1FromXml();
        var btnId = `polybox1_${gv_polyIdCur}__${gv_polyIdCur}__complete`;

        // set marker data for google map marker object
        gv_markersGgMp = [];
        gv_markerOrder = 0;
    
        for (var j = 0; j < gv_markerInfos.length; j++){
            gv_markerOrder++;
            gv_markerInfos[j]._order = gv_markerOrder;
            const lat = parseFloat(gv_markerInfos[j]._lat);
            const lon = parseFloat(gv_markerInfos[j]._lon);
            var latLon = new google.maps.LatLng(lat, lon);

            // set marker 
            var markerSet = {
                position: latLon,
                map: gv_map,
                label: {
                    text: gv_polyIdCur + "-" + gv_markerOrder,
                    color: "#000",
                    fontSize: "14px"
                },
                icon: gv_markerColorDict[tmpColor]
            };
            const tmpMarker = new google.maps.Marker(markerSet);   
            tmpMarker._order = gv_markerOrder;
            gv_markersGgMp.push(tmpMarker);

            // set the marker window
            var content = f_markerWindow(lat, lon, gv_polyIdCur, gv_markerOrder, tmpColor, false);
            const infoWindow = new google.maps.InfoWindow({content: content});

            google.maps.event.addListener(tmpMarker, "click", ()=>{
                infoWindow.open({
                    anchor: tmpMarker,
                    gv_map,
                    shouldFocus: false
                });
            });
        }

        f_completeDrawPolygonFromXml(btnId, tmpColor);
    }
}

function f_dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.files.length > 1){
        alert("You can upload xml file only by one-by-one.");
    }
    var file = ev.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = function(ev) {
        f_parseXml(ev.target.result);
    };
    reader.readAsText(file);

    return false;
}

function f_dragOverHandler(ev){
    try{
        document.getElementsByClassName("div3_2_xml_box")[0].className = "div3_2_xml_box_hover";
        document.getElementsByClassName("drop_box_p")[0].className = "drop_box_p_hover";
    } catch (error){}
    
    ev.preventDefault();
}

function f_dragLeaveHandler(ev){
    try{
        document.getElementsByClassName("div3_2_xml_box_hover")[0].className = "div3_2_xml_box";
        document.getElementsByClassName("drop_box_p_hover")[0].className = "drop_box_p";
    } catch (error){}
}

function f_panToPolygon(btnId){
    // set polygon ID data
    var idArr = btnId.split("__");
    gv_polyIdCur = idArr[1];
    gv_polygonDict[gv_polyIdCur];
    var polygonCenter = f_calPolygonCenter()
    var latAvg = polygonCenter[0];
    var lonAvg = polygonCenter[1];
    f_initMapWithCoordi(latAvg, lonAvg);
}

function f_calPolygonCenter(){
    var lat_sum = 0;
    var lon_sum = 0;
    var lon_max = -300;
    var lon_min = 300;
    var tmp_lon = 0;
    for(var i = 0; i < gv_polygonDict[gv_polyIdCur]._markerList.length; i++){
        lat_sum += parseFloat(gv_polygonDict[gv_polyIdCur]._markerList[i]._lat);
        tmp_lon = parseFloat(gv_polygonDict[gv_polyIdCur]._markerList[i]._lon);
        lon_sum += tmp_lon;
        if (tmp_lon < lon_min && tmp_lon > 90){
            lon_min = tmp_lon;
        } 
        if (tmp_lon > lon_max && tmp_lon < -90){
            lon_max = tmp_lon
        }
    }
    var latAvg = lat_sum / gv_polygonDict[gv_polyIdCur]._markerList.length;
    var lonAvg = lon_sum / gv_polygonDict[gv_polyIdCur]._markerList.length;
    if(lon_max * lon_min < 0 && lon_min - lon_max > 180){
        var cnt_lon = (lon_max + 360 + lon_min)/2;
        console.log(latAvg, lon_max, lon_min, cnt_lon);
        return [latAvg, cnt_lon];
    }
    return [latAvg, lonAvg];
}

function f_initMapPutMarkersWithCoordi(tmpPolyId_in, latAvg, lonAvg) { 
    // Confirm the data type of polygon ID
    var tmpPolyId = tmpPolyId_in.toString();

    // Initialize the google map api  
    const mapbase = {  
        center: new google.maps.LatLng(latAvg, lonAvg),  
        zoom: 5,  
        mapTypeId: google.maps.MapTypeId.roadmap  
    }  
    gv_map = new google.maps.Map(document.getElementById("div2_map"), mapbase);  

    gv_map.addListener("click", (e) => {        // marker can be checked
        f_putMarker(e.latLng);
    });
    
    // put markers if any.    
    gv_polyIdCur = tmpPolyId;
    const polyIdConst = tmpPolyId;
    if (gv_markerInfos.length > 0){
        gv_markerInfos = f_iterationCopyArrMkInfo(gv_polygonDict[polyIdConst]._markerList);

        var polyColor = gv_polygonDict[polyIdConst]._color;
        gv_markersGgMp = [];
        gv_markerOrder = 0;
    
        for (var i = 0; i < gv_markerInfos.length; i++){
            gv_markerOrder++;
            const tmpMarkerOrder = gv_markerOrder;
            gv_markerInfos[i]._order = tmpMarkerOrder;
            const lat = parseFloat(gv_markerInfos[i]._lat);
            const lon = parseFloat(gv_markerInfos[i]._lon);
            var latLon = new google.maps.LatLng(lat, lon);

            // set marker 
            var markerSet = {
                position: latLon,
                map: gv_map,
                label: {
                    text: polyIdConst + "-" + tmpMarkerOrder,
                    color: "#000",
                    fontSize: "14px"
                },
                icon: gv_markerColorDict[polyColor]
            };
            const tmpMarker = new google.maps.Marker(markerSet);   
            tmpMarker._order = tmpMarkerOrder;
            gv_markersGgMp.push(tmpMarker);

            // set the marker window
            var content = f_markerWindow(lat, lon, polyIdConst, tmpMarkerOrder, polyColor, false);
            const infoWindow = new google.maps.InfoWindow({content: content});

            google.maps.event.addListener(tmpMarker, "click", ()=>{
                infoWindow.open({
                    anchor: tmpMarker,
                    gv_map,
                    shouldFocus: false
                });
            });
        }
        gv_markerOrder++;
    }
    
    // set marine traffic density maps
    var marineTrafficUrl = 'https://tiles3.marinetraffic.com/densitymaps2017/density_tiles2017/{z}/{x}/{y}.png';
    var layer;
    var layerID = 'Density map';

    layer = new google.maps.ImageMapType({
        name: layerID,
        getTileUrl: function(coord, zoom) {
            var url = marineTrafficUrl
            .replace('{x}', coord.x)
            .replace('{y}', coord.y)
            .replace('{z}', zoom);
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
    });
    layer.setOpacity(0.7);

    gv_map.mapTypes.set(layerID, layer);    // Apply the new tile layer to the map.
    gv_map.overlayMapTypes.push(layer);
    
    // draw polygons if any.
    if (Object.keys(gv_polygonDict).length > 0) {
        f_drawPolygons();
    }
}  