<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta para login
Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

// Ruta para recuperación de contraseña
Route::get('/recuperar', function () {
    return Inertia::render('Recuperar');
})->name('recuperar');

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

// Rutas para Clientes
Route::get('/clientes', function () {
    return Inertia::render('Clientes/Index');
})->name('clientes.index');

Route::get('/clientes/nuevo', function () {
    return Inertia::render('Clientes/Form');
})->name('clientes.create');

Route::get('/clientes/{id}', function ($id) {
    return Inertia::render('Clientes/Show', ['id' => $id]);
})->name('clientes.show');

Route::get('/clientes/{id}/editar', function ($id) {
    return Inertia::render('Clientes/Form', ['id' => $id]);
})->name('clientes.edit');

// Rutas para Correos
Route::get('/correos', function () {
    return Inertia::render('Correos/Index');
})->name('correos.index');

// Formularios para Correos
Route::get('/correos/nuevo', function () {
    return Inertia::render('Correos/Form');
})->name('correos.create');

Route::get('/correos/{id}', function ($id) {
    return Inertia::render('Correos/Show', ['id' => $id]);
})->name('correos.show');

Route::get('/correos/{id}/editar', function ($id) {
    return Inertia::render('Correos/Form', ['id' => $id]);
})->name('correos.edit');

// Rutas para Cuenta Juegos
Route::get('/cuentas_juego', function () {
    return Inertia::render('CuentaJuegos/Index');
})->name('cuentas_juego.index');

Route::get('/cuentas_juego/nuevo', function () {
    return Inertia::render('CuentaJuegos/Form');
})->name('cuentas_juego.create');

Route::get('/cuentas_juego/{id}', function ($id) {
    return Inertia::render('CuentaJuegos/Show', ['id' => $id]);
})->name('cuentas_juego.show');

Route::get('/cuentas_juego/{id}/editar', function ($id) {
    return Inertia::render('CuentaJuegos/Form', ['id' => $id]);
})->name('cuentas_juego.edit');

// Rutas para Facturas
Route::get('/facturas', function () {
    return Inertia::render('Facturas/Index');
})->name('facturas.index');

Route::get('/facturas/nueva', function () {
    return Inertia::render('Facturas/Form');
})->name('facturas.create');

Route::get('/facturas/{id}', function ($id) {
    return Inertia::render('Facturas/Show', ['id' => $id]);
})->name('facturas.show');

Route::get('/facturas/{id}/editar', function ($id) {
    return Inertia::render('Facturas/Form', ['id' => $id]);
})->name('facturas.edit');
