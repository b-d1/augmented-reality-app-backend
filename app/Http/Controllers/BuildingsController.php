<?php

namespace App\Http\Controllers;

use App\Building;
use App\Landmark;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class BuildingsController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function show($id)
    {
        $building = Building::findOrFail($id);
        $location = DB::select('SELECT ST_AsText(buildings.location) FROM buildings WHERE "id" = ' . $id);
        $landmarks = Landmark::where('building_id', $id)->get();
        $landmark_count = Landmark::where('building_id', $id)->count();
        return view('buildings.show', compact('building', 'location', 'landmarks', 'landmark_count'));
    }

    public function insert()
    {
        return view('buildings.insert');
    }


    public function store(Request $request)
    {

        $this->validate($request, [
            "building_name" => "required",
            "building_address" => "required",
            "building_location" => "required"
        ],
            [
                "building_name.required" => "The building's name field is required!",
                "building_address.required" => "The building's address field is required!",
                "building_location.required" => "The building's location field is required!"
            ]);

        $building = Building::where('name', $request->building_name)->get();
        if ($building && count($building) > 0) {
            $request->session()->flash('error', 'Building with name ' . $request->building_name . ', already exists!');
            return redirect()->route("home");
        }

        $building = new Building();
        $building->name = $request->building_name;
        $building->address = $request->building_address;
        $building->location = $request->building_location;
        $building->save();
        $request->session()->flash('status', 'Building was added successfully!');
        return redirect()->route("home");
    }

    public function delete(Request $request, $id)
    {
        $building = Building::findOrFail($id);
        $building->delete();
        $request->session()->flash('status', 'Building was successfully deleted.');
        return redirect()->route("home");
    }

    public function edit(Request $request, $id)
    {
        $building = Building::findOrFail($id);
        $location = DB::select('SELECT ST_AsText(buildings.location) FROM buildings WHERE "id" = ' . $id);
        return view('buildings.edit', compact('building'))->with('location', $location);
    }

    public function update(Request $request, $id)
    {
        $building = Building::findOrFail($id);
        $this->validate($request, [
            "building_name" => "required",
            "building_address" => "required",
            "building_location" => "required" // Validate location left to implement.
        ],
            [
                "building_name.required" => "The building's name field is required!",
                "building_address.required" => "The building's address field is required!",
                "building_location.required" => "The building's location field is required!"
            ]);
        $building->name = $request->building_name;
        $building->address = $request->building_address;
        $building->location = $request->building_location;
        $building->save();
        $request->session()->flash('status', 'Building was successfully updated!');
        return redirect()->route("show-building", array("id" => $id));
    }


}
