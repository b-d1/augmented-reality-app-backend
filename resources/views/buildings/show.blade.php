@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading"><i class="fa fa-building"></i> {{ $building->name }}</div>
                    <div class="panel-body">
                        @if (Session::has("status"))
                            <div class="alert alert-success"><i class="fa fa-smile-o" aria-hidden="true"></i>
                                {{ Session::get('status') }}
                            </div>
                        @endif

                        @if (Session::has("error"))
                              <div class="alert alert-danger"><i class="fa fa-frown-o" aria-hidden="true"></i>
                                 {{ Session::get('error') }}
                              </div>
                        @endif

                        <h4><i class="fa fa-info-circle"></i> Info about building {{ $building->name }} </h4>
                        <hr>
                        <p>Name: <b> {{ $building->name }} </b></p>
                        <p>Address: <b> {{ $building->address }} </b></p>
                        <p>Number of landmarks: <b> {{ $landmark_count }} </b></p>
                        <hr>
                        <input type="hidden" id="building_location_show" value="{{ $location[0]->st_astext }}" />
                            <div id="google_map"></div>
                            <div id="osm_map"></div>
                        <hr>
                        <h4><i class="fa fa-map"></i> Landmarks</h4>
                        @if ($landmark_count > 0 )
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Description</th>
                                        <th>Location</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                @foreach ($landmarks as $landmark)
                                <tr>
                                    <td>{{ $landmark->id }}</td>
                                    <td id="description{{$landmark->id}}">{{ $landmark->name }}</td>
                                    <td><span id="lat{{$landmark->id}}">{{ $landmark->getReadableLocation($landmark->id)["lat"] }}</span>, <span id="lng{{$landmark->id}}">{{ $landmark->getReadableLocation($landmark->id)["lng"] }}</span>, <span id="alt{{$landmark->id}}">{{ $landmark->getReadableLocation($landmark->id)["alt"] }}</span></td>
                                    <td><a href="/edit-landmark/{{ $landmark->id }}">Edit</a></td>
                                    <td><a href="/delete-landmark/{{ $building->id }}/{{ $landmark->id }}">Delete</a></td>
                                </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                        @else
                        <p>No landmarks added for this building yet.</p>
                        @endif
                        <hr>
                        <div class="btn-group-right">
                            <a href="/edit-building/{{$building->id}}" class="btn btn-info"><i class="fa fa-pencil-square-o"></i> Edit building</a>
                            <a href="/insert-landmark/{{$building->id}}" class="btn btn-success"><i class="fa fa-map-marker"></i> Add landmark</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
@endsection

@section('js-scripts')
    <script src="/js/show_map.js" async></script>
    <script src="/js/osm_show_map.js" async></script>
@endsection
