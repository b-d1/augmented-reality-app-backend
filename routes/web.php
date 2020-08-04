<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@index');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

// Web service route
Route::get('/checkLocation/{location}', 'HomeController@checkLocation');


// Building routes

Route::get('/building/{id}', 'BuildingsController@show')->name("show-building");
Route::get('/insert-building', 'BuildingsController@insert')->name("insert-building");
Route::post('/insert-building', 'BuildingsController@store');
Route::get('/delete-building/{id}', 'BuildingsController@delete');
Route::get('/edit-building/{id}', 'BuildingsController@edit')->name("edit-building");
Route::post('/edit-building/{id}', 'BuildingsController@update');

// Landmark routes

Route::get('/insert-landmark/{id}', 'LandmarksController@insert')->name("insert-landmark");
Route::post('/insert-landmark/{id}', 'LandmarksController@store');
Route::get('/delete-landmark/{building}/{landmark}', 'LandmarksController@delete');
Route::get('/edit-landmark/{id}', 'LandmarksController@edit')->name("edit-landmark");
Route::post('/edit-landmark/{id}', 'LandmarksController@update');