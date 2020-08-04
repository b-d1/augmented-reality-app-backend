@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading"><i class="fa fa-building" aria-hidden="true"></i>
                         Insert building</div>

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
                            {{ csrf_field() }}
                            <div class="form-group">
                                <label for="building_name">Building name:</label>
                                <input type="text" name="building_name" id="building_name" class="form-control" placeholder="ФИНКИ" />
                            </div>
                            <div class="form-group">
                                <label for="building_address">Building Address:</label>
                                <input type="text" name="building_address" id="building_address" class="form-control" placeholder="ул. Руѓер Бошковиќ 16"  />
                            </div>
                            <div class="form-group">
                                <label for="building_location">Building Location:</label>
                                <textarea name="building_location" id="building_location" cols="3" rows="3" class="form-control" placeholder="MULTIPOLYGON (((20 10, 10 10, 5 5, 20 10)))"></textarea>
                            </div>
                            <div id="google_map"></div>
                            <div id="osm_map"></div>
                            <hr>
                            <div class="form-group btn-group-right">
                                <button type="button" class="btn btn-secondary" id="save_location"><i class="fa fa-refresh"></i> Update location</button>
                                <button type="submit" class="btn btn-success"><i class="fa fa-plus"></i> Insert building</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js-scripts')
    <script src="https://unpkg.com/leaflet-draw@0.4.9/dist/leaflet.draw.js"></script>
    <script src="https://unpkg.com/leaflet-draw@0.4.9/dist/leaflet.draw-src.js"></script>
    <script src="/js/insert_map.js"></script>
    <script src="/js/osm_insert_map.js" async></script>
@endsection