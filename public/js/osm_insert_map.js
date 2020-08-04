if (localStorage.mapType) {
    if (localStorage.mapType == "osm") {

        var polygons = [];

        // Code for checking, and positioning the map to the location typed by the user at #building_address field.
        $('#building_address').focusout(function () {
            positionMap();
        });

        function positionMap() {
            var geocoder = new google.maps.Geocoder();
            var address = $("#building_address").val();

            if (geocoder) {
                geocoder.geocode({'address': address}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $("#building_address").css("border", "1px solid #ccd0d2");
                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();
                        osmMap.setView([lat, lng], 18);
                    }
                    else {
                        $("#building_address").css("border", "1px solid red");
                    }
                });
            }
        }


        // Map setup
        var osmMap = L.map('osm_map').setView([41.588766, 21.7499833], 8);
        var features = [];

        osmMap.defaults = {
            editable: true,
            color: '#AA0000',
            weight: 3,
            opacity: 1.0,
            fillColor: '#AA0000',
            fillOpacity: 0.2,
            maxZoom: 20
        };

        var layer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmxhZ29qIiwiYSI6ImNpeXQ1cjcwajAwMHUzMm1tNXl4YjBrdWMifQ.15zerTBncJk0STZGx68kUg', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 20,
            id: '256',
            accessToken: 'pk.eyJ1IjoiYmxhZ29qIiwiYSI6ImNpeXQ1cjcwajAwMHUzMm1tNXl4YjBrdWMifQ.15zerTBncJk0STZGx68kUg'
        });

        layer.addTo(osmMap);
        // Drawing editor setup.
        var drawnItems = new L.FeatureGroup();
        osmMap.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            draw: {
                polygon: true,
                marker: false,
                circle: false,
                rectangle: false,
                polyline: false
            },
            edit: false
        });
        osmMap.addControl(drawControl);

        layer.on("load", function () {
            osmMap.invalidateSize();
        });

        // Add polygon to the map, and save it.
        osmMap.on('draw:created', function (e) {
            var layer = e.layer;
            drawnItems.addLayer(layer);
            var geojson = layer.toGeoJSON();
            var wkt = Terraformer.WKT.convert(geojson.geometry);
            polygons.push(wkt);
        });

        // Constructing and displaying the drawn object from the map, at the #building_location field
        $("body").on("click", "#save_location", function() {
            document.getElementById("building_location").value = "";
           var contentString = "MULTIPOLYGON (";
           var length = polygons.length;
           for(var i = 0; i < length;i++) {
               var polygon = polygons[i];
               polygon = polygon.substring(8);
               contentString += polygon;
               if(i != length - 1) {
                   contentString += ', '
               }

           }
           contentString += ")";
            document.getElementById("building_location").value += contentString;

        });


    }
}