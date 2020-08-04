if (localStorage.mapType) {
    if (localStorage.mapType == "osm") {

        // Map setup
        var osmMap = L.map('osm_map').setView([10, 20], 2);
        var features = [];
        var polygonsArray = [];
        var polygonsArrayObj = [];
        var case1 = false;
        var case2 = false;
        var bounds;


        osmMap.defaults = {
            editable: false,
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
            }
        });
        osmMap.addControl(drawControl);

        mapIt(true, true);


        layer.on("load", function () {
            osmMap.invalidateSize();
            // Pan the map to the feature
            if (case1) {
                osmMap.fitBounds(bounds);
            }
            else if (case2) {
                osmMap.setView(bounds);
            }
        });


        //  Maps the current contents of the #building_location field.
        function mapIt(editable, focus) {
            var config, el, obj, wkt;

            // Indicates that the map should pan and/or zoom to new features
            focus = true;

            if (editable === undefined) {
                editable = true;
            }

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
                        alert('Wicket could not understand the WKT string you entered. Check that you have parentheses balanced, and try removing tabs and newline characters.');
                        return;
                    }
                }
            }


            obj = wkt.toObject(osmMap.defaults); // Make an object

            if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
                        (obj[i]).addTo(osmMap);
                        features.push(obj[i]);
                    }
                }
            } else {
                // Add editable objects to the map (because Wicket doesn't support this by default.)
                var count = obj._latlngs.length;
                for (i = 0; i < count; i++) {

                    var countJ = obj._latlngs[i].length;
                    for (j = 0; j < countJ; j++) {
                        var countK = obj._latlngs[i][j].length;
                        var polygon = [];
                        for (k = 0; k < countK; k++) {
                            var arr = [obj._latlngs[i][j][k].lat, obj._latlngs[i][j][k].lng];
                            polygon.push(arr);
                        }
                        var poly = new L.Polygon(polygon);
                        osmMap.addLayer(poly);
                        var geojson = poly.toGeoJSON();
                        var text = Terraformer.WKT.convert(geojson.geometry);
                        polygonsArrayObj.push(poly);
                        polygonsArray.push(text);

                    }
                }
            }

            // Focusing on the object
            if (focus && obj.getBounds !== undefined && typeof obj.getBounds === 'function') {
                case1 = true;
                bounds = obj.getBounds();
                osmMap.fitBounds(obj.getBounds());
            } else {
                if (focus && obj.getLatLng !== undefined && typeof obj.getLatLng === 'function') {
                    osmMap.setView(obj.getLatLng());
                    case2 = true;
                    bounds = obj.getLatLng();
                }

            }

        }

        // Enabling editing on the polygon, and adding listener, only if there is one polygon on the map.
        var objLength = polygonsArrayObj.length;

        if (objLength == 1) {
            polygonsArrayObj[0].editing.enable();
            polygonsArrayObj[0].on('edit', function () {
                var geojson = this.toGeoJSON();
                var text = Terraformer.WKT.convert(geojson.geometry);
                polygonsArray[0] = text;
            });
        }

        // Add polygon to the map, and save it.
        osmMap.on('draw:created', function (e) {
            var layer = e.layer;
            drawnItems.addLayer(layer);
            var geojson = layer.toGeoJSON();
            var wkt = Terraformer.WKT.convert(geojson.geometry);
            polygonsArrayObj.push(layer);
            polygonsArray.push(wkt);
        });

        // Constructing and displaying the drawn object from the map, at the #landmark_location_edit field
        $("body").on("click", "#update_location", function () {
            document.getElementById("building_location_edit").value = "";
            var contentString = "MULTIPOLYGON(";
            var length = polygonsArray.length;
            for (var i = 0; i < length; i++) {
                var polygon = polygonsArray[i];
                polygon = polygon.substring(8);
                contentString += polygon;
                if (i != length - 1) {
                    contentString += ', '
                }

            }
            contentString += ")";
            document.getElementById("building_location_edit").value += contentString;

        });


    }
}