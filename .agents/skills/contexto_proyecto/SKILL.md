---
name: contexto_proyecto
description: Contexto técnico y estado actual del proyecto Gestión de Ventas (GestVentas)
---

# Proyecto GestVentas (psvs_panel)

## 📌 1. Arquitectura y Stack Tecnológico

El proyecto es un sistema de administración / dashboard (CRM de ventas para juegos, cuentas, etc.) construido sobre una arquitectura monolítica moderna.

**Backend (API & Enrutamiento):**
- **Laravel 13** con PHP 8.3+.
- **Base de Datos:** SQLite (desarrollo).
- **Tests:** PestPHP.

**Frontend (Vistas y SPA):**
- **Inertia.js** actuando como puente entre Laravel y React.
- **React 19** para la construcción de la interfaz.
- **Tailwind CSS v4** para estilos utilitarios y responsivos.
- **Zustand** para la gestión del estado global (si aplica).
- **Vite 8** como empaquetador ultrarrápido (comando `npm run dev` activo).
- **Lucide React** para iconografía.

## 📁 2. Estructura Principal del Proyecto

- `app/`: Lógica general de negocio de Laravel (Controladores, Modelos, etc.).
- `routes/web.php`: Rutas principales. Devuelven las vistas de React usando `Inertia::render()`.
- `resources/js/`: El núcleo visual del sistema.
  - `Layouts/`: Contenedores principales (ej. `MainLayout.jsx` con sidebar y overlay móvil accesible).
  - `Pages/`: Mapeo directo a pantallas de la aplicación (ej. `Dashboard`, `Clientes`, `Facturas`, `Juegos`).
  - `Services/`: Conectores a la API (`api.js`) para peticiones asíncronas vía Axios.

## 🛠️ 3. Reglas y Convenciones de Desarrollo

1. **Accesibilidad UI:** Todos los elementos interactivos personalizados deben ser accesibles (ej. usar etiquetas nativas `<button>` en lugar de usar `<div>` con `role="button"`).
2. **Estética Visual:** Se mantiene un entorno *Dark Theme* con diseño premium (colores corporativos `#0b0d12`, tarjetas translúcidas, animaciones en las transiciones de menús).
3. **Componentes Funcionales:** Uso estricto de componentes funcionales en React.jsx.
4. **Evitar Archivos Innecesarios:** Respaldos del proyecto en carpetas específicas o git (se omite de control de versiones directorios como `_boceto`, `.vscode`, `.agents`).

---
Este skill puede ser consultado como referencia en cualquier momento para entender cómo debe modificarse o escalarse el proyecto en el futuro.
