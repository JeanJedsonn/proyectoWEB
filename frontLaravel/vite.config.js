import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',       // Escucha en todas las interfaces
        cors: true,
        hmr: {
            host: '192.168.100.2', // Le dice al browser dónde conectar el HMR
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
