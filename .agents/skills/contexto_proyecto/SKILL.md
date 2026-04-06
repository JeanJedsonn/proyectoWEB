---
name: contexto_proyecto
description: Contexto técnico y estado actual del proyecto Gestión de Ventas (GestVentas)
---

# Proyecto GestVentas (psvs_panel)

## 📌 1. Arquitectura y Stack Tecnológico

El proyecto es un sistema de administración / dashboard (CRM de ventas para juegos, cuentas, etc.) construido sobre una arquitectura moderna de monorepositorio.

**Estructura del Repositorio:**
- `/frontLaravel/`: Aplicación principal (Laravel + Inertia + React).
- `/backNode/`: Servidor de API de datos (Node.js + Express + SQL).

**Tecnologías Core:**
- **Backend (Routing/Frontend Server):** Laravel 10+ cargando vistas via **Inertia.js**.
- **Backend Data (API):** Node.js Server (`localhost:3000`) para persistencia y lógica de negocio.
- **Frontend:** React 18/19, Tailwind CSS v4, Lucide React icons, Axios.

## 📁 2. Módulos Implementados (Estado Actual)

### 🎮 Módulo de Juegos (Completo)
- `Index.jsx`: Catálogo en grid responsivo con búsqueda y paginación.
- `Show.jsx`: Métricas de venta y listado de cuentas asignadas.
- `Form.jsx`: CRUD completo con zona de peligro y gestión de metadatos.

### 👥 Módulo de Clientes (Completo)
- `Index.jsx`: Tablas dinámicas con filtros por origen (Instagram, WhatsApp, etc.).
- `Show.jsx`: Perfil detallado con historial de compras e interacción social.
- `Form.jsx`: Creación/Edición con validaciones y campos opcionales (notas, redes).

### 📧 Módulo de Correos (Completo)
- `Index.jsx`: Bóveda de correos base con iconos por proveedor (Gmail, Outlook).
- `Show.jsx`: Visualización de credenciales y cuentas de juego dependientes.
- `Form.jsx`: Gestión de claves, métodos de recuperación y redireccionamiento.

### 🔑 Módulo de Cuenta Juegos (Completo)
- `Index.jsx`: Inventario de cuentas por plataforma con detección de 2FA.
- `Show.jsx`: Detalles técnicos, semilla de recuperación, dirección JSON y catálogo de juegos incluidos.
- `Form.jsx`: Asignación multiselect de juegos, selector de correo matriz y regionalización.

## 🛠️ 3. Reglas y Convenciones de Desarrollo

1. **Diseño Premium:** Tema ultra-oscuro (`#0b0d12` / `#161821`), bordes `white/5`, y radios de curvatura amplios (`rounded-4xl`).
2. **Navegación:** Uso de `Link` y `router` de `@inertiajs/react` para mantener el estado de SPA.
3. **Flujo de Trabajo Git:** Rama `develop` para integración, ramas `Front` y `Back` para desarrollo específico.

---
*Última actualización: Ciclo CRUD completo para Juegos, Clientes, Correos y Cuenta Juegos.*
