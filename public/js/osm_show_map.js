if (localStorage.mapType) {
    if (localStorage.mapType == "osm") {

        // Map setup
        var osmMap = L.map('osm_map').setView([10, 20], 2);
        var features = [];
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
        mapIt(true, false);

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


        //  Maps the current contents of the #building_location_show field.
        function mapIt(editable, focus) {
            var config, el, obj, wkt;

            // Indicates that the map should pan and/or zoom to new features
            focus = true;

            if (editable === undefined) {
                editable = true;
            }

            el = document.getElementById('building_location_show');
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

            config = osmMap.defaults;
            config.editable = editable;

            obj = wkt.toObject(osmMap.defaults); // Make an object

            if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
                        (obj[i]).addTo(osmMap);
                        features.push(obj[i]);
                    }
                }
            } else {
                obj.addTo(osmMap); // Add it to the map
                features.push(obj);
            }


            // Map the landmarks to the map
            var num_landmarks = $("tbody tr").length;
            var i;
            for (i = 0; i < num_landmarks; i++) {
                var row = $("tbody tr").eq(i);
                var landmark_id = $(row).children().first().html();
                var lng = $(row).find("#lng" + landmark_id).html();
                var lat = $(row).find("#lat" + landmark_id).html();
                var alt = $(row).find("#alt" + landmark_id).html();
                lng = parseFloat(lng);
                lat = parseFloat(lat);
                var marker = L.marker([lat, lng]);
                var name = $(row).find("#description" + landmark_id).html();
                marker.bindPopup(name);
                marker.addTo(osmMap);

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


    }
}