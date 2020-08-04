@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading"><i class="fa fa-tachometer" aria-hidden="true"></i>
                        Dashboard
                    </div>

                    <div class="panel-body">
                        @if (Session::has("status"))
                            <div class="alert alert-success">
                                <i class="fa fa-smile-o" aria-hidden="true"></i>
                                 {{ Session::get('status') }}
                            </div>
                        @endif

                            @if (Session::has("error"))
                                <div class="alert alert-danger"><i class="fa fa-frown-o" aria-hidden="true"></i>
                                    {{ Session::get('error') }}
                                </div>
                            @endif

                        <h4 class="text-center"><i class="fa fa-cogs"></i> Map settings</h4>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input class="form-check-input map-settings" type="radio" name="map-settings" id="gmaps" value="gmaps">
                                    Google Maps
                                </label>
                            </div>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input class="form-check-input map-settings" type="radio" name="map-settings" id="osm" value="osm">
                                    Open Street Map
                                </label>
                            </div>
                        <hr/>
                        <h4 class="text-center"><i class="fa fa-building" aria-hidden="true"></i>
                            Buildings</h4>
                            @if ($buildings && count($buildings) > 0)
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach ($buildings as $building)
                                    <tr>
                                        <td><a href="/building/{{$building->id}}">{{ $building->id }}</a></td>
                                        <td><a href="/building/{{$building->id}}">{{ $building->name }}</a></td>
                                        <td>{{ $building->address }}</td>
                                        <td><a href="/edit-building/{{$building->id}}"><i class="fa fa-pencil-square-o"
                                                                                          aria-hidden="true"></i>
                                                Edit</a></td>
                                        <td><a href="/delete-building/{{$building->id}}"><i class="fa fa-trash-o"
                                                                                            aria-hidden="true"></i>
                                                Delete</a></td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                            @else
                                <p class="text-center">No buildings added yet <i class="fa fa-frown-o" aria-hidden="true"></i></p>
                            @endif
                        <hr/>
                        <div class="row">
                            <div class="col-md-12">
                                <a href="/insert-building" class="btn btn-primary btn-block"><i class="fa fa-"></i><i
                                            class="fa fa-building" aria-hidden="true"></i>
                                    Add building</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
