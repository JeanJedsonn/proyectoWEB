---
name: contexto_proyecto
description: Contexto técnico y estado actual del proyecto Gestión de Ventas (GestVentas)
---

# Proyecto GestVentas (psvs_panel)

## 📌 1. Arquitectura y Stack Tecnológico

El proyecto es un sistema de administración / dashboard (CRM de ventas para juegos, cuentas, etc.) construido sobre una arquitectura moderna.

**Backend (Frontend Server & Routing):**
- **Laravel 10+** (PHP 8.2+) sirviendo la aplicación a través de **Inertia.js**.
- **Enrutamiento:** Definido en `routes/web.php`.

**Backend Data (API):**
- **Node.js Server** (corriendo en `localhost:3000`).
- Provee endpoints para:
  - Paginación de juegos: `/juegos/juegos_por_pagina/:perPage/num_pagina/:page`
  - Lectura de un juego: `/juegos/leer_juego/:id`
  - Formulario (CRUD): `/juegos/form_juego/` (POST para crear, GET/PATCH/DELETE para gestionar por ID).

**Frontend (Vistas y SPA):**
- **React 18/19** e **Inertia.js**.
- **Tailwind CSS v4** para diseño premium oscuro.
- **Lucide React** para iconos.
- **Axios** para comunicación con la API de Node.js.

## 📁 2. Estructura Principal del Proyecto

- `resources/js/Pages/Juegos/`:
  - `Index.jsx`: Catálogo principal con grid responsivo, búsqueda y paginación.
  - `Show.jsx`: Vista detallada de un juego basándose en el boceto `read_juego.html` (Métricas de venta y listado de cuentas asignadas).
  - `Form.jsx`: Formulario dinámico para añadir, editar y eliminar (Zona de Peligro) juegos del catálogo base (boceto `form_juego.html`).
- `resources/js/Layouts/MainLayout.jsx`: Contenedor principal con sidebar persistente y navegación responsiva.

## 🛠️ 3. Reglas y Convenciones de Desarrollo

1. **Accesibilidad UI:** Priorizar el uso de elementos semánticos (ej. `<button>`, `<label htmlFor="...">`).
2. **Estética Visual:** Tema oscuro (#0b0d12 / #161821), bordes translúcidos (`border-white/5`), y acentos en índigo (`#6366f1`).
3. **Comunicación de Datos:** Todas las peticiones al catálogo de juegos deben pasar por el servicio de Node.js configurado en `localhost:3000`.

---
*Este skill se actualiza a medida que el proyecto escala. Última actualización: Implementación completa del módulo de Juegos (CRUD).*
