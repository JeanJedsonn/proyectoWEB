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

### 🎮 Módulo de Juegos (Refactorizado con UI Components)
- `Index.jsx`: Catálogo en grid responsivo. **Referencia actual para la nueva arquitectura de componentes.**
- `Show.jsx`: Métricas de venta y listado de cuentas asignadas.
- `Form.jsx`: CRUD completo con zona de peligro y gestión de metadatos.

### 👥 Módulo de Clientes (Completo)
- `Index.jsx`: Tablas dinámicas con filtros por origen. (Pendiente refactorizar a UI Components)
- `Show.jsx`: Perfil detallado con historial de compras e interacción social.
- `Form.jsx`: Creación/Edición con validaciones.

### 📧 Módulo de Correos (Completo)
- `Index.jsx`: Bóveda de correos base con iconos por proveedor. (Pendiente refactorizar a UI Components)
- `Show.jsx`: Visualización de credenciales.
- `Form.jsx`: Gestión de claves y recuperación.

### 🔑 Módulo de Cuenta Juegos (Completo)
- `Index.jsx`: Inventario de cuentas por plataforma. (Pendiente refactorizar a UI Components)
- `Show.jsx`: Detalles técnicos y semilla de recuperación.
- `Form.jsx`: Asignación multiselect de juegos y regionalización.

## 📍 3. Sistema de Componentes UI (Atomic Design)

Se ha establecido un sistema de componentes atómicos para garantizar la consistencia visual y reducir la redundancia de código.

**Ubicación:** `frontLaravel/resources/js/Components/UI/`

| Componente | Descripción | Uso Principal |
| :--- | :--- | :--- |
| **`Badge.jsx`** | Etiquetas de estado y plataformas | Tabla de cuentas, Detail views |
| **`Button.jsx`** | Botones con variantes y estados de carga | Acciones globales, Formularios |
| **`Card.jsx`** | Contenedor estándar con bordes inteligentes | Paneles de información, Grids |
| **`Input.jsx`** | Campos de texto con soporte para iconos | Búsqueda, Formularios CRUD |
| **`Select.jsx`** | Selectores personalizados de alta fidelidad | Paginación, Opciones de formulario |
| **`PageHeader.jsx`** | Encabezado de página unificado (Breadcrumbs + Título + Acciones) | Todas las vistas principales |
| **`Pagination.jsx`** | Control de navegación de datos | Listados paginados (Index) |

## 🎨 4. Paleta de Colores y Estética UI

Basado en un esquema **Ultra-Dark Premium**, la paleta se rige por transparencias y bordes definidos:

| Categoría | Tailwind / Hex | Aplicación |
| :--- | :--- | :--- |
| **Base Fondo** | `#0b0d12` | Fondo de body y zonas de contraste |
| **Card Fondo** | `#161821` | Contenedores principales y cards |
| **Índigo (Accent)** | `indigo-500/10` | Fondos de badges y botones secundarios |
| **Índigo (Accent)** | `indigo-500/20` | Bordes de elementos activos o seleccionados |
| **Esmeralda (Success)** | `emerald-500/10` | Fondos de badges de estado "Activo" |
| **Esmeralda (Success)** | `emerald-500/20` | Bordes de confirmación o éxito |
| **Rojo (Danger)** | `red-500/10` | Fondos de botones de eliminación o errores |
| **Rojo (Danger)** | `red-500/20` | Bordes de zonas de peligro y alertas rápidas |
| **Neutros** | `white/5` | Bordes estándar de tarjetas y inputs (sutil) |
| **Neutros** | `gray-500` | Bordes de dropdowns y selectores abiertos |
| **Tipografía** | `gray-400/500` | Textos secundarios, hints y labels |

## 🛠️ 5. Reglas y Convenciones de Desarrollo

1. **Diseño Premium:** Uso estricto de transparencias y bordes de 1px.
2. **Redondez (Borders):** El radio predeterminado para componentes atómicos e inputs es **`2xl`**. Las tarjetas de información de gran tamaño pueden escalar a **`4xl`**.
3. **Navegación:** Uso de `Link` y `router` de `@inertiajs/react` para mantener el estado de SPA.
4. **Componentización:** Al crear o modificar vistas, se DEBEN utilizar los componentes de `Components/UI/` en lugar de clases ad-hoc de Tailwind.

---
*Última actualización: Estándares de redondez y paleta de colores.*
