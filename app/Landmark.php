<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
class Landmark extends Model
{
    //
    use PostgisTrait;
    protected $postgisFields = ['point'];


    public static function getReadableLocation($id) {
        $location = DB::select('SELECT ST_AsText(landmarks.location) FROM landmarks WHERE "id" = ' . $id);
        $location = $location[0]->st_astext;
        $arr = explode("(", $location);
        $points = explode(" ", $arr[1]);
        $lng = $points[0];
        $lat = $points[1];
        $alt = $points[2];
        $alt = substr($alt, 0, -1);
        return array("lat" => $lat, "lng" => $lng, "alt" => $alt);

    }
}
