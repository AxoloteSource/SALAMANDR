<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('assets/{path}', function ($path) {
    $filePath = resource_path("js/assets/{$path}");
    if (! File::exists($filePath)) {
        abort(404);
    }

    return response()->file($filePath);
})->where('path', '.*');

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
