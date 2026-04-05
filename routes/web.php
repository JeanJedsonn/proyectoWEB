<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta para la vista principal, se encuentra en resources/js/Pages/Dashboard.jsx
Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// Rutas para Juegos
Route::get('/juegos', function () {
    return Inertia::render('Juegos/Index');
})->name('juegos.index');

Route::get('/juegos/nuevo', function () {
    return Inertia::render('Juegos/Form');
})->name('juegos.create');

Route::get('/juegos/{id}', function ($id) {
    return Inertia::render('Juegos/Show', ['id' => $id]);
})->name('juegos.show');

Route::get('/juegos/{id}/editar', function ($id) {
    return Inertia::render('Juegos/Form', ['id' => $id]);
})->name('juegos.edit');
