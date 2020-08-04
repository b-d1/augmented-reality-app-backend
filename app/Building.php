<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;

class Building extends Model
{
    use PostgisTrait;

    protected $postgisFields = ['multipolygon'];
}
