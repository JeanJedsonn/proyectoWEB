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
- `Show.jsx`: Métricas de venta, listado de cuentas asignadas vinculadas activamente mediante Inertia y navegación controlada.
- `Form.jsx`: CRUD con validación de nombre, y "Zona de Peligro" inteligente (bloquea la eliminación mostrando razones y deshabilitando botones si detecta la bandera `tiene_cuentas` en la BBDD).

### 👥 Módulo de Clientes (Refactorizado con UI Components)
- `Index.jsx`: Tablas dinámicas con filtros por origen. (100% Componentes Atómicos)
- `Show.jsx`: Perfil detallado con historial de compras e interacción social.
- `Form.jsx`: Creación/Edición con validaciones.

### 📧 Módulo de Correos (Refactorizado con UI Components)
- `Index.jsx`: Bóveda de correos base con iconos por proveedor y selector de densidad de datos (10, 25, 50 registros).
- `Show.jsx`: Visualización técnica de credenciales sin botones de copiado innecesarios para mantener la limpieza visual.
- `Form.jsx`: Gestión de claves con validación de dependencias (bloquea la eliminación si existen cuentas vinculadas) y migración completa a componentes atómicos.

### 🔑 Módulo de Cuenta Juegos (Refactorizado con UI Components)
- `Index.jsx`: Inventario de cuentas por plataforma. (100% Componentes Atómicos)
- `Show.jsx`: Detalles técnicos y semilla de recuperación.
- `Form.jsx`: Asignación multiselect de juegos y regionalización.

### 🧾 Módulo de Facturas (Finalizado - 100% Atómico)
- `Index.jsx`: Historial de ventas paginado con filtros avanzados. (100% Componentes Atómicos)
- `Show.jsx`: Vista de Recibo Imprimible (Receipt Layout) con modo Vendedor/Cliente dinámico, exportación a PDF y CSS de `@media print` optimizado. Incluye PageHeader estandarizado.
- `Form.jsx`: Generación de facturas con multi-fetch, buscador integrado de clientes mediante **`QuickSelectList`**, y selector de extracción de snapshot histórico (Correo/Clave) de Cuentas Matrices.

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
| **`QuickSelectList.jsx`** | Listas de búsqueda rápida con dot indicator y sublabels | Selector de Clientes y Cuentas en Facturas |

> [!TIP]
> **Campos Obligatorios:** Los componentes `Input` y `Select` incluyen automáticamente un punto rojo (`●`) junto al label cuando el atributo `required` está presente, mejorando la usabilidad sin recargar el diseño.

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
5. **Modern JS:** Preferir el uso de `globalThis`, `Number.parseInt` y `Number.isNaN` para compatibilidad y consistencia técnica en Backend y Frontend.

## 🔒 6. Seguridad y Autenticación

El sistema implementa una arquitectura moderna de seguridad separada entre Node.js y React:

1. **JWT y Autenticación:**
   - Node.js emite un JWT (1 hora de validez) tras validar el login (`authController.js`).
   - **Axios Global Interceptors:** En `bootstrap.js` toda petición saliente inyecta dinámicamente el `Bearer Token`. Si Node devuelve un `401 Unauthorized` por expiración, el interceptor expulsa limpia y automáticamente al usuario al `/login`.

2. **Niveles de Acceso y Roles:**
   - Se ha implementado un sistema de roles manejado por `adminMiddleware.js` en el Backend.
   - **Rol 'master':** Posee acceso total a funciones administrativas y de gestión de usuarios.
   - **Usuario Estándar:** Acceso restringido a módulos básicos de ventas y facturación.
   - La validación de roles se realiza en cada petición protegida extrayendo el rol directamente del JWT.

3. **Recuperación de Contraseñas (Zero-Mail):**
   - El ecosistema incluye un Wizard estético de 2 fases en `Recuperar.jsx`.
   - Modela 3 preguntas secretas en la Base de Datos.
   - **Case Insensitivity:** Node corrige errores (espacios, mayúsculas) y verifica estrictamente contra Hashes Matemáticos de `bcrypt`. El texto plano jamás se guarda.

4. **Manejo Seguro de Archivos / Raw JSON:**
   - En lugar de redirigir la ventana del explorador nativo para leer archivos, el frontend utiliza `Axios` para descargar Blobs y generar un `URL.createObjectURL(blob)`, manteniendo los tokens 100% ocultos en los headers y garantizando cero fugas en el historial.

## 🔔 7. Sistema de Notificaciones y Feedback Visual

El proyecto ha desautorizado el uso de componentes de tipo "Toast" emergentes globales, optando por no recargar visualmente la interfaz y mantener la estética Premium.

1. **Acciones Rápidas (Ej: Copiar al portapapeles):** Se utiliza una notificación minimalista estandarizada que aparece en la parte inferior derecha (`fixed bottom-10 right-10`). Debe ser una caja con fondo blanco, texto negro (`bg-white text-black`), bordes muy redondeados (`rounded-2xl`), tipografía técnica (`font-black uppercase text-[10px]`) y una sombra intensa (`shadow-[0_20px_50px_rgba(255,255,255,0.2)]`). 
    - **Contenido:** Icono `Check` + texto "Copiado al Portapapeles".
    - **Regla técnica:** Toda interacción con el portapapeles debe incorporar un mecanismo de respaldo (*fallback*) usando `document.execCommand('copy')` sobre un `textarea` invisible para garantizar funcionalidad en contextos HTTP o locales.
2. **Alertas y Errores (Formularios/Listados):** Se renderizan de forma **inline** e incrustadas directamente dentro de la interfaz mediante el componente `Alert`, usando fondos atenuados y animaciones suaves. 
3. **Zona de Peligro (Operaciones Críticas):** Se ha unificado el diseño bajo el componente `Card variant="danger"`. 
    - **Comportamiento:** Si un registro no puede eliminarse (por dependencias en BBDD), el botón de acción se renderiza en estilo `secondary`, con el icono `Shield`, deshabilitado, y un mensaje explicativo sobre la razón del bloqueo técnico (Ej. *"No se puede eliminar: Existen cuentas vinculadas..."*). Esto previene errores de integridad referencial y mejora el UX.

## 🌐 8. Configuración de Red y API (Acceso LAN)

El proyecto ha sido refactorizado para permitir el acceso desde múltiples dispositivos dentro de la misma red local (LAN).

1. **VITE_NODE_API_URL:** 
   - Ubicado en el archivo `.env` del frontend.
   - Define la dirección IP y puerto del servidor Node.js (Ej: `http://192.168.100.2:3000`).
   - Reemplaza todas las referencias estancadas de `localhost:3000` para garantizar conectividad multiplataforma.

2. **Acceso Externo:** 
   - El servidor Laravel debe iniciarse con `--host=0.0.0.0` para ser visible en la red.
   - El servidor Node.js escucha en todas las interfaces por defecto o mediante configuración de host específica.

---
*Última actualización: Estandarización Total y Refactorización de Acceso por Red Local.*
