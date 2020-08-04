@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading"><i class="fa fa-pencil-square-o"></i> Edit building</div>

                    <div class="panel-body">
                        @if (count($errors) > 0)
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        @if (Session::has("status-edit"))
                            <div class="alert alert-success"><i class="fa fa-smile-o" aria-hidden="true"></i>
                                {{ Session::get('status-edit') }}
                            </div>
                        @endif

                        <form action="" method="post">
                            {{ csrf_field() }}
                            <div class="form-group">
                                <label for="building_name">Building name:</label>
                                <input type="text" name="building_name" id="building_name" class="form-control" value="{{ $building->name  }}" />
                            </div>
                            <div class="form-group">
                                <label for="building_address">Building Address:</label>
                                <input type="text" name="building_address" id="building_address_edit" class="form-control" value="{{ $building->address  }}" />
                            </div>
                            <div class="form-group">
                                <label for="building_location">Building Location:</label>
                                <textarea name="building_location" id="building_location_edit" cols="3" rows="10" class="form-control">{{ $location[0]->st_astext }}</textarea>
                            </div>
                            <div id="google_map"></div>
                            <div id="osm_map"></div>
                            <hr />
                            <div class="form-group btn-group-right">
                                <button type="button" class="btn btn-secondary" id="update_location"><i class="fa fa-refresh"></i> Update location</button>
                                <button type="submit" class="btn btn-success"><i class="fa fa-building"></i> Save building</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js-scripts')
    <script src="https://unpkg.com/leaflet-draw@0.4.9/dist/leaflet.draw-src.js"></script>
    <script src="https://unpkg.com/leaflet-draw@0.4.9/dist/leaflet.draw.js"></script>
    <script src="/js/edit_map.js" async></script>
    <script src="/js/osm_edit_map.js" async></script>
@endsection