// Script for saving the map type into local storage.
$(document).ready(function() {

    if(localStorage.mapType) {
        $('input[type=radio][name=map-settings]').prop('checked', false);
        $("#" + localStorage.mapType).prop('checked', true);

        if(localStorage.mapType == "osm") {
            $("#google_map").hide();
            $("#osm_map").show();
        }
        else if(localStorage.mapType == "gmaps") {
            $("#osm_map").hide();
            $("#google_map").show();
        }

    }

   $('input[type=radio][name=map-settings]').change(function() {
       var mapType = $(this).attr("value");
       localStorage.setItem("mapType", mapType);
   })
});