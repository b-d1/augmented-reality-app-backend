@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading"><i class="fa fa-pencil-square-o"></i> Edit landmark</div>

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

                        @if (Session::has("status"))
                            <div class="alert alert-success"><i class="fa fa-smile-o" aria-hidden="true"></i>
                                {{ Session::get('status') }}
                            </div>
                        @endif

                        <form action="" method="post">
                            <input type="hidden" id="building_location" name="building_location" value="{{$building_location}}">
                            {{ csrf_field() }}
                            <div class="form-group">
                                <label for="landmark_name">Landmark description:</label>
                                <input type="text" name="landmark_name" id="landmark_name" class="form-control"  value="{{$landmark->name}}"/>
                            </div>
                            <div class="form-group">
                                <label for="landmark_object">Landmark object (for drawing):</label>
                                <textarea name="landmark_object" id="landmark_object" cols="3" rows="3" class="form-control">{{$landmark->object}}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="landmark_location">Landmark location:</label>
                                <input type="text" name="landmark_location" id="landmark_location" class="form-control" value="{{$landmark_location}}">
                            </div>
                            <div id="google_map"></div>
                            <div id="osm_map"></div>
                            <hr>
                            <div class="form-group btn-group-right">
                                <button type="button" class="btn btn-secondary" id="save_location"><i class="fa fa-refresh"></i> Update location</button>
                                <button type="submit" class="btn btn-success"><i class="fa fa-map-marker"></i> Save landmark</button>
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
    <script src="/js/edit_landmark_map.js" async></script>
    <script src="/js/osm_edit_landmark_map.js" async></script>
@endsection