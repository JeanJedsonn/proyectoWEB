import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// -----------------------------------------------------------------------------
// JWT AUTORIZACIÓN: Interceptores globales para consumir la API protegida Node.js
// -----------------------------------------------------------------------------

// 1. Interceptar cada petición saliente para incrustarle el token si existe en LocalStorage
window.axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Interceptar respuestas fallidas de Node para expulsar al usuario si el token venció (401)
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Acceso denegado o token expirado. Redirigiendo al Login.');
            localStorage.removeItem('token');
            // Redirección dura porque podríamos estar en cualquier punto del árbol SPA
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

