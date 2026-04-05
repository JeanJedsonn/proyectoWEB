{{-- punto de arranque de la aplicacion --}}

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>Dashboard</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    @viteReactRefresh   {{-- permite que los componentes de react se actualicen en tiempo real --}}
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])    {{-- carga los archivos css y jsx que son procesados por vite --}}
    @inertiaHead    {{-- contiene la informacion de la ruta actual para que react sepa que componente renderizar --}}
</head>
<body class="font-sans antialiased text-white bg-[#0b0d12]">
    @inertia {{-- renderiza el componente de react que corresponde a la ruta actual --}}
</body>
</html>
