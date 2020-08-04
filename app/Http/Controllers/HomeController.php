<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Building;
use App\Landmark;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $buildings = Building::orderBy('id', 'asc')->get();
        return view('home', compact('buildings'));
    }

    public function checkLocation($location) {
        // Check if the location is contained in the area of some of the buildings;
        $building_location = DB::select('SELECT id FROM buildings WHERE ST_CONTAINS(CAST(location AS geometry), ST_SetSRID(ST_MakePoint(' . $location . '), 4326))');

        $arr = array('status' => false);
        if($building_location) {
        //  Check if some of the landmarks is in the range of 5 meters of entered location
            $point = DB::select('SELECT id, object FROM landmarks WHERE ST_3DDwithin(CAST(location AS geometry), CAST(ST_MakePoint(' . $location . ') AS geometry), 5) AND building_id =' . $building_location[0]->id);

            if($point) {
                // If it is found, return status true, and the object to be drawn (object is entered by the user, and it can be of any format.)
                if(count($point) == 1) {
                    $arr['status'] = true;
                    $arr['object'] = $point[0]->object;
                }
            }
        }
        return response($arr)->header('Content-Type', 'application/json');
    }

}
