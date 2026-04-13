# GestVentas - Sistema de Administración de Ventas (psvs_panel)

Bienvenido al proyecto **GestVentas**, una solución moderna para la administración de ventas, clientes e inventario de cuentas de juegos. El proyecto está estructurado como un monorepositorio con un frontend en Laravel/Inertia/React y un backend de datos en Node.js/Express.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **PHP** (v8.1 o superior)
- **Composer** (Gestor de dependencias de PHP)
- **PostgreSQL** (Base de datos principal)

---

## 🛠️ Configuración del Proyecto

Sigue estos pasos en orden para poner en marcha el sistema:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd proyectoWEB
```

### 2. Configuración del Backend (Node.js)
El servidor de Node maneja la lógica de negocio y la persistencia de datos.

1. Navega a la carpeta del backend:
   ```bash
   cd backNode
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las credenciales de la base de datos:
   - Abre el archivo `databaseCredentials.js`.
   - Modifica los valores de `user`, `host`, `database`, `password` y `port` según tu instalación local de PostgreSQL.
4. Inicializa la base de datos (Creación de tablas):
   ```bash
   node createTables.js
   ```
5. **Carga de Datos Iniciales (Seeders):**
   Para tener un usuario administrador y datos de prueba, ejecuta:
   ```bash
   node seeders/databaseSeeder.js
   ```

### 3. Configuración del Frontend (Laravel + React)
El frontend proporciona la interfaz de usuario y la comunicación con la API.

1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontLaravel
   ```
2. Instala las dependencias de PHP y JavaScript:
   ```bash
   composer install
   npm install
   ```
3. Configura el archivo de entorno:
   - Crea tu archivo `.env` basado en el ejemplo:
     ```bash
     cp .env.example .env
     ```
   - Genera la clave de aplicación: 
     ```bash
     php artisan key:generate
     ```
4. **Configuración de la API:**
   - En el archivo `.env`, busca la variable `VITE_NODE_API_URL`.
   - Establece la IP donde corre tu servidor Node. 
     - Local: `http://localhost:3000`
     - Red Local: `http://<TU_IP_LOCAL>:3000`

---

## ⚡ Ejecución del Proyecto

Para que el sistema funcione correctamente, debes iniciar ambos servicios simultáneamente.

### Iniciar Backend
Desde la carpeta `backNode`:
```bash
npm run dev
```

### Iniciar Frontend
Abre dos terminales en la carpeta `frontLaravel`:

**Terminal 1 (Servidor Laravel):**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

**Terminal 2 (Compilación de activos):**
```bash
npm run dev
```

---

## 🔑 Acceso al Sistema

Una vez ejecutado el seeder (`databaseSeeder.js`), puedes ingresar con las siguientes credenciales por defecto:

- **Correo:** `admin@admin.com`
- **Contraseña:** `admin123`

> [!NOTE]
> Este usuario tiene nivel **Master (Nivel 3)**, lo que le permite gestionar otros usuarios y acceder a todas las secciones administrativas.

## 📱 Acceso desde la Red Local (LAN)
Para acceder desde un móvil u otra PC en la misma red:
1. Asegúrate de que `VITE_NODE_API_URL` en el `.env` del frontend use tu IP real (ej. `192.168.x.x`).
2. El servidor Laravel debe estar corriendo con el flag `--host=0.0.0.0`.
3. Abre el navegador en el otro dispositivo e ingresa a `http://<TU_IP_LOCAL>:8000`.
