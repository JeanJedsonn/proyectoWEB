

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>Dashboard</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>   
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>    
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>    
</head>
<body class="font-sans antialiased text-white bg-[#0b0d12]">
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } ?> 
</body>
</html>
<?php /**PATH C:\PROYETO\web\proyectoWEB\frontLaravel\resources\views/app.blade.php ENDPATH**/ ?>