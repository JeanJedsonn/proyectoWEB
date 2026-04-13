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

## 📁 2. Módulos Implementados (Arquitectura de Grids y Tarjetas)

El proyecto ha migrado de un sistema basado en tablas a una interfaz moderna de **Grids Responsivos** utilizando tarjetas modulares con diseño premium.

### 🎮 Módulo de Juegos
- `Index.jsx`: Catálogo en grid responsivo de 6 columnas (xl). Utiliza `GameCard`.
- `Show.jsx`: Métricas de venta y navegación mediante el componente global **`JuegoNavButton`**.
- `Form.jsx`: CRUD con validación y "Zona de Peligro" inteligente.

### 👥 Módulo de Clientes
- `Index.jsx`: Grid responsivo de **`ClienteCard`**. Incluye filtros avanzados por red social y búsqueda debounced.
- `Show.jsx`: Perfil detallado con historial de facturación integrado mediante `JuegoNavButton`.
- `Form.jsx`: Gestión de perfiles con **validación condicional** (WhatsApp requiere teléfono obligatorio en Backend y Frontend).

### 📧 Módulo de Correos
- `Index.jsx`: Bóveda de correos en grid de **`CorreoCard`** con detección automática de iconos por proveedor (Gmail, Outlook, etc.).
- `Show.jsx`: Visualización técnica de credenciales.
- `Form.jsx`: CRUD con bloqueo de eliminación preventiva si existen dependencias.

### 🧾 Módulo de Facturas
- `Index.jsx`: Historial de ventas en grid de **`FacturaCard`**. Soporta 12 registros por página para un layout equilibrado.
- `Show.jsx`: Recibo imprimible optimizado.
- `Form.jsx`: Generación de facturas con snapshot histórico y búsqueda rápida.

### 📊 Dashboard Operativo
- **Métricas KPI**: Tarjetas de estadísticas con diseño ultra-premium, reflejando ingresos del mes, clientes y stock.
- **Actividad Reciente**: Grid dinámico de las últimas 5 ventas utilizando `FacturaCard` en su variante **`dark`**.
- **Distribución**: Gráfico de dónut animado para ventas por tipo (Primaria/Secundaria).

## 📍 3. Sistema de Componentes UI

### 🧱 Componentes Atómicos (UI Library)
Ubicación: `frontLaravel/resources/js/Components/UI/`

| Componente | Descripción |
| :--- | :--- |
| **`PageHeader.jsx`** | Encabezado unificado con breadcrumbs y acciones. |
| **`Button.jsx`** | Acciones con variantes (primary, secondary, danger) y estados de carga. |
| **`Input.jsx` / `Select.jsx`** | Entradas de datos con soporte de iconos y validación visual. |
| **`Pagination.jsx`** | Control de navegación estandarizado para grids. |
| **`JuegoNavButton.jsx`** | Botón genérico de navegación con soporte para iconos, badges y subtítulos. |

### 🎴 Componentes de Negocio (Cards)
Ubicación: `frontLaravel/resources/js/Components/[Modulo]/`

- **`GameCard.jsx`**: Portada visual del juego con overlay de acciones.
- **`FacturaCard.jsx`**: Ficha contable con fallbacks para múltiples formatos de API y variante `dark`.
- **`ClienteCard.jsx`**: Perfil de contacto con acceso directo a WhatsApp y badges sociales.
- **`CorreoCard.jsx`**: Identificador de cuenta con distinción visual de proveedores.

## 🎨 4. Estética y Reglas de Diseño

1. **Ultra-Dark Premium**: Fondo base en `#0b0d12` y contenedores en `#161821`.
2. **Geometría**: Uso de radios de borde curvos (**`rounded-3xl`** para cards, **`rounded-4xl`** para contenedores maestros).
3. **Feedback de Datos**: Los cards deben implementar "fallbacks" inteligentes (operadores OR `||`) para manejar inconsistencias en los nombres de campos de la API (ej: `titulo_juego || titulo`).
4. **Interactividad**: Efectos de hover con bordes `indigo-500/50` y sombras difuminadas.

## 🛠️ 5. Convenciones de Backend (Node.js)

1. **Persistencia**: Uso estricto de `pool.query` con parámetros indexados para prevenir SQL Injection.
2. **Validaciones**: Las reglas de negocio deben duplicarse en el controlador (Backend). Ej: Si la red es WhatsApp, el teléfono no puede ser nulo.
3. **Joins**: Preferir `LEFT JOIN` para obtener títulos y metadatos relacionados en lugar de subconsultas costosas.
4. **Consistencia**: Los controladores de obtención por página deben retornar siempre el objeto con `data`, `current_page`, `last_page`, `per_page` y `total`.

---
*Última actualización: Modernización completa del Frontend a arquitectura basada en Grids y Cards.*
