import axios from 'axios';

const api = axios.create({
    // Lee la URL de .env si existe o usa localhost:3000 por defecto
    baseURL: import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor para manejar errores asíncronos limpiamente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la API de Node.js:', error);
        return Promise.reject(error);
    }
);

export default api;