var gmap; // Variable for the map

var features = []; // Array for the features of the drawn objects

var polygons = []; // Array for the polygons of the drawn objects (used for displaying the WKT object in the textbox)

// Options for the map
var myOptions = {
    center: new google.maps.LatLng(30, 10),
    defaults: {
        editable: true,
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

    el = document.getElementById('building_location_edit');
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
    // Add listeners for overlay editing events
    if (!Wkt.isArray(obj) && wkt.type !== 'point') {
        // New vertex is inserted
        google.maps.event.addListener(obj.getPath(), 'insert_at', function (n) {
            polygons.push(obj);
            updateText();
        });
        // Existing vertex is removed (insertion is undone)
        google.maps.event.addListener(obj.getPath(), 'remove_at', function (n) {
            polygons.push(obj);
            updateText();
        });
        // Existing vertex is moved (set elsewhere)
        google.maps.event.addListener(obj.getPath(), 'set_at', function (n) {
            polygons.push(obj);
            updateText();
        });
    } else {
        if (obj.setEditable) {
            obj.setEditable(false);
        }
    }

    var bounds = new google.maps.LatLngBounds();

    if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
        for (i in obj) {
            if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
                obj[i].setMap(gmap);
                features.push(obj[i]);
                polygons.push(obj[i]);
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
/**
 * Updates the textarea based on the first available feature.
 */
function updateText() {
    var wkt = new Wkt.Wkt();
    wkt.fromObject(features[0]);
    document.getElementById('building_location_edit').value = wkt.write();
}

function updateTextPart() {
    var i, w, v;

    w = new Wkt.Wkt(features[0]);

    i = 1;
    while (i < features.length) {
        v = new Wkt.Wkt(features[i]);
        w.merge(v);
        i += 1;
    }

    document.getElementById('building_location_edit').value = w.write();
}


// Initializing the map
function init() {
    gmap = new google.maps.Map(document.getElementById("google_map"), myOptions);

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
            editable: true,
            draggable: true
        }
    });

    google.maps.event.addDomListener(drawingManager, 'polygoncomplete', function (polygon) {
        polygons.push(polygon);
    });

    drawingManager.setMap(gmap);
    drawingManager.setDrawingMode(null);


    // Constructing and displaying the drawn object from the map, at the #building_location_edit field
    google.maps.event.addDomListener(update_location, 'click', function () {
        document.getElementById("building_location_edit").value = "";
        var contentString = "MULTIPOLYGON (";
        for (var i = 0; i < polygons.length; i++) {
            var vertices = (polygons[i]).getPath();
            var first = vertices.getAt(0);
            contentString += "((";
            for (var j = 0; j < vertices.getLength(); j++) {
                var xy = vertices.getAt(j);

                contentString += xy.lng() + ' ' + xy.lat();
                if (j != vertices.getLength() - 1) {
                    contentString += ', ';
                }
                else {
                    contentString += ', ' + first.lng() + ' ' + first.lat();
                }
            }
            if (i != polygons.length - 1) {
                contentString += ")), ";
            }
            else {
                contentString += "))";
            }

        }
        contentString += ")";
        document.getElementById("building_location_edit").value += contentString;
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