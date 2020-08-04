var gmap; // Variable for the map

var features = []; // Array for the features of the drawn objects

// Options for the map
var myOptions = {
    center: new google.maps.LatLng(30, 10),
    defaults: {
        editable: false,
        strokeColor: '#1E90FF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#1E90FF',
        fillOpacity: 0.35
    },
    panControl: false,
    streetViewControl: false,
    zoom: 2,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
        style: google.maps.ZoomControlStyle.SMALL
    }
};

//  Maps the current contents of the #building_location_edit field.
function mapIt() {
    var el, obj, wkt;

    el = document.getElementById('building_location');
    wkt = new Wkt.Wkt();

    if (el.last === el.value) { // Remember the last string
        return; // Do nothing if the WKT string hasn't changed
    } else {
        el.last = el.value;
    }

    try { // Catch any malformed WKT strings
        wkt.read(el.value);
    } catch (e1) {
        try {
            wkt.read(el.value.replace('\n', '').replace('\r', '').replace('\t', ''));
        } catch (e2) {
            if (e2.name === 'WKTError') {
                alert('The string object entered is not valid.');
                return;
            }
        }
    }

    obj = wkt.toObject(gmap.defaults); // Make an object

    var bounds = new google.maps.LatLngBounds();

    if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
        for (i in obj) {
            if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
                obj[i].setMap(gmap);
                features.push(obj[i]);

                if (wkt.type === 'point' || wkt.type === 'multipoint')
                    bounds.extend(obj[i].getPosition());
                else
                    obj[i].getPath().forEach(function (element, index) {
                        bounds.extend(element)
                    });
            }
        }

        features = features.concat(obj);
    } else {
        obj.setMap(gmap); // Add it to the map
        features.push(obj);
        if (wkt.type === 'point' || wkt.type === 'multipoint')
            bounds.extend(obj.getPosition());
        else
            obj.getPath().forEach(function (element, index) {
                bounds.extend(element)
            });
    }

    // Pan the map to the feature
    gmap.fitBounds(bounds);

    return obj;
}

// Initializing the map
function init() {
    gmap = new google.maps.Map(document.getElementById("google_map"), myOptions);
    var drawingManager;
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        markerOptions: {
            draggable: true
        },
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.MARKER]
        },
        map: gmap
    });

    var marker_cnt;

    google.maps.event.addDomListener(drawingManager, 'markercomplete', function (marker) {
        marker_cnt = marker;
        drawingManager.setDrawingMode(null);
        drawingManager.setMap(null);
    });

    // Constructing and displaying the drawn object from the map, at the #landmark_location field
    google.maps.event.addDomListener(save_location, 'click', function () {
        document.getElementById("landmark_location").value = "";
        var lat = marker_cnt.getPosition().lat();
        var lng = marker_cnt.getPosition().lng();
        var contentString = "POINT Z (";
        contentString += lng + ' ' + lat + ' ' + 0;
        contentString += ")";
        document.getElementById("landmark_location").value += contentString;
    });

    google.maps.event.addListener(gmap, 'tilesloaded', function () {
        if (!this.loaded) {
            this.loaded = true;
            mapIt();
        }
    });

}

google.maps.event.addDomListener(window, 'load', init);
google.maps.event.trigger(gmap, 'resize');