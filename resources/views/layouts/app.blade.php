<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="/css/app.css" rel="stylesheet">
    <link href="/css/custom.css" rel="stylesheet">
    <link href="/css/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
    <link rel="stylesheet" href="/css/leaflet.draw.css" />
    <!-- Scripts -->
    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
    <!-- Scripts -->
    <script src="/js/app.js"></script>
    <script src="/js/jquery-3.1.1.min.js"></script>
    <!-- Google maps drawing library-->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8ZrNB0d13cJl7uB7GT3-ChcrU2XMEHk0&libraries=drawing"></script>

    <!-- Wicket library, https://github.com/arthur-e/Wicket -->
    <script src="/js/wicket.js"></script>

    <!-- Leaflet library, http://leafletjs.com/ -->
    <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>

    <!-- Additional scripts for leaflet and google maps -->
    <script src="/js/leaflet-providers.js"></script>
    <script src="/js/wicket-gmap3.js"></script>

    <!--  Script for saving the map type into local storage.-->
    <script src="/js/map_settings.js"></script>

    <!-- Terraformer, https://github.com/Esri/Terraformer-->
    <script src="https://unpkg.com/terraformer@1.0.7"></script>

    <!-- Terraformer WKT parser, http://terraformer.io/wkt-parser/-->
    <script src="https://unpkg.com/terraformer-wkt-parser@1.1.2"></script>

    <!-- Dynamically loading scripts, depending on the view.-->
    @yield('js-scripts')


</head>
<body>
        @include('layouts.nav')
        @yield('content')
        @include('layouts.footer')
</body>
</html>
