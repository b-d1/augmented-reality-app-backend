<?php

namespace App\Http\Controllers;

use App\Landmark;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class LandmarksController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function insert($id)
    {
        $location = DB::select('SELECT ST_AsText(buildings.location) FROM buildings WHERE "id" = ' . $id);
        return view('landmarks.insert', compact('id', 'location'));
    }

    public function store(Request $request, $id)
    {
        $this->validate($request, [
            "landmark_name" => "required",
            "landmark_object" => "required",
            "landmark_location" => "required"
        ],
            [
                "landmark_name.required" => "The landmarks's description field is required!",
                "landmark_object.required" => "The landmarks's object field is required!",
                "landmark_location.required" => "The landmarks's location field is required!"
            ]);
        $landmark = DB::select("SELECT * FROM landmarks WHERE name='" . $request->landmark_name . "' AND building_id =" . $id);
        if ($landmark) {
            $request->session()->flash('error', 'Landmark with name ' . $request->landmark_name . ', already exists!');
            return redirect()->route("show-building", array("id" => $id));
        }

        $landmark = new Landmark();
        $landmark->name = $request->landmark_name;
        $landmark->location = $request->landmark_location;
        $landmark->object = $request->landmark_object;
        $landmark->building_id = $id;
        $landmark->save();
        $request->session()->flash('status', 'Landmark was added successfully!');
        return redirect()->route("show-building", array("id" => $id));
    }

    public function delete(Request $request, $building, $landmark)
    {
        $landmark = Landmark::findOrFail($landmark);
        $landmark->delete();
        $request->session()->flash('status', 'Landmark was successfully deleted.');
        return redirect()->route("show-building", ['id' => $building]);
    }


    public function edit($id)
    {
        $landmark = Landmark::findOrFail($id);
        $building_location = DB::select('SELECT ST_AsText(buildings.location) FROM (buildings JOIN landmarks ON buildings.id = landmarks.building_id) WHERE landmarks.id = ' . $id);
        $building_location = $building_location[0]->st_astext;
        $landmark_location = DB::select('SELECT ST_AsText(landmarks.location) FROM landmarks WHERE "id" = ' . $id);
        $landmark_location = $landmark_location[0]->st_astext;

        return view('landmarks.edit', compact('landmark', 'building_location', 'landmark_location'));
    }

    public function update(Request $request, $id)
    {

        $this->validate($request, [
            "landmark_name" => "required",
            "landmark_object" => "required",
            "landmark_location" => "required"
        ],
            [
                "landmark_name.required" => "The landmarks's description field is required!",
                "landmark_object.required" => "The landmarks's object field is required!",
                "landmark_location.required" => "The landmarks's location field is required!"
            ]);

        $landmark = Landmark::findOrFail($id);
        $landmark->name = $request->landmark_name;
        $landmark->location = $request->landmark_location;
        $landmark->object = $request->landmark_object;
        $building_id = $landmark->building_id;
        $landmark->save();
        $request->session()->flash('status', 'Landmark was updated successfully!');
        return redirect()->route("show-building", ['id' => $building_id]);
    }


}
