var gmap; // Variable for the map

// Options for the map (Positioned to show the whole map of R.Macedonia)
var myOptions = {
    center: new google.maps.LatLng(41.588766, 21.7499833),
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
    zoom: 8,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
        style: google.maps.ZoomControlStyle.SMALL
    }
};


// Code for checking, and positioning the map to the location typed by the user at #building_address field.
$(document).on("focusout","#building_address", function() {
    var geocoder = new google.maps.Geocoder();
    var address = $(this).val();


    if (geocoder) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $("#building_address").css("border", "1px solid #ccd0d2");
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                myOptions = {
                    center: new google.maps.LatLng(lat, lng),
                    zoom: 18
                };
                init();
            }
            else {
                $("#building_address").css("border", "1px solid red");
            }
        });
    }
});

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
            editable: true
        }
    });

    drawingManager.setMap(gmap);
    var polygons = [];

    google.maps.event.addDomListener(drawingManager, 'polygoncomplete', function (polygon) {
        polygons.push(polygon);
    });


    // Constructing and displaying the drawn object from the map, at the #building_location field
    google.maps.event.addDomListener(save_location, 'click', function () {
        document.getElementById("building_location").value = "";
        var contentString = "MULTIPOLYGON (";
        for (var i = 0; i < polygons.length; i++) {
            var vertices = polygons[i].getPath();
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
        document.getElementById("building_location").value += contentString;
    });
}

google.maps.event.addDomListener(window, 'load', init);
google.maps.event.trigger(gmap, 'resize');