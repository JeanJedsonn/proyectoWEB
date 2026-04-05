<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta para la vista principal, se encuentra en resources/js/Pages/Dashboard.jsx
Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');
