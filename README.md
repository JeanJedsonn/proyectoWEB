📚 Proyecto Web - Laravel + Node.js
👥 Equipo de Desarrollo
Nombre	DNI
Jeanmarco Alarcon	27.117.926
Luigi Quero	30.009.785
Gabriel Rodríguez	30.172.571
---
📋 Tabla de Contenidos
Requisitos Previos
Instalación del Proyecto
Opción 1: Laravel Herd (Recomendado)
Opción 2: XAMPP
Opción 3: Artisan
Configuración de Node.js
Base de Datos PostgreSQL
Configuración Final
Ejecución del Proyecto
---
🔧 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:
PHP 8.x o superior
Composer
Node.js y npm
PostgreSQL
Git
📥 Clonar el Repositorio
```bash
git clone https://github.com/JeanJedsonn/taller3.git
cd taller3
```
---
🚀 Instalación del Proyecto
Opción 1: Laravel Herd (Recomendado)
Laravel Herd es la forma más sencilla de configurar el entorno en Windows.
1. Instalar Laravel Herd
Descarga e instala desde: https://herd.laravel.com/windows
> 💡 **Nota:** Herd instalará automáticamente PHP, Composer y configurará el servidor web local.
2. Ubicar el Proyecto
Mueve el proyecto a tu directorio de trabajo (por ejemplo, dentro de la carpeta `Herd` que crea el instalador).
3. Instalar Dependencias
```bash
composer install
```
4. Vincular el Proyecto en Herd
Abre el panel de Herd
Ve a la sección Sites
Selecciona "Link existing project" y elige la carpeta raíz del proyecto
Accede desde tu navegador usando la URL proporcionada (ej: `http://frontlaravel.test/`)
---
Opción 2: XAMPP
1. Instalar XAMPP
Descarga desde: https://www.apachefriends.org/download.html
2. Ubicar el Proyecto
Mueve la carpeta del proyecto a:
```
C:\xampp\htdocs\frontLaravel
```
3. Iniciar Apache
Abre el Panel de Control de XAMPP e inicia el servicio Apache.
4. Instalar Dependencias
```bash
composer install
```
5. Acceder al Proyecto
Abre tu navegador y ve a: `http://localhost/frontLaravel/public`
---
Opción 3: Artisan
1. Verificar PHP
Asegúrate de tener PHP en tu variable de entorno `PATH`.
2. Instalar Dependencias
```bash
composer install
```
3. Iniciar el Servidor
```bash
php artisan serve
```
Si el puerto está ocupado o hay problemas de configuración:
```bash
php -S localhost:8000 -t public
```
4. Acceder al Proyecto
Abre tu navegador y ve a: `http://127.0.0.1:8000`
---
⚙️ Configuración de Node.js
1. Instalar Dependencias del Backend
Navega a la carpeta `backNode`:
```bash
cd backNode
npm install
```
2. Instalar Dependencias del Frontend
Navega a la carpeta `frontLaravel`:
```bash
cd ../frontLaravel
npm install
```
> ⚠️ **Nota:** `npm start` puede fallar si PostgreSQL no está instalado en tu equipo.
---
🗄️ Base de Datos PostgreSQL
1. Instalar PostgreSQL
Descarga el instalador desde: https://www.postgresql.org/download/
2. Configuración Inicial
Durante la instalación:
Anota la contraseña del usuario `postgres`
Configura el puerto (por defecto: 5432)
Opcionalmente, crea una base de datos específica para el proyecto
3. Crear la Base de Datos
Conectarse a PostgreSQL
```bash
sudo -iu postgres psql
```
Crear la Base de Datos
```sql
CREATE DATABASE nombre_db;
```
(Opcional) Crear un Usuario Específico
Si deseas usar un usuario diferente al superusuario:
```sql
CREATE USER nombre_usuario WITH PASSWORD 'contraseña';
GRANT ALL PRIVILEGES ON DATABASE nombre_db TO nombre_usuario;
GRANT CREATE, USAGE ON SCHEMA public TO nombre_usuario;
```
---
🛠️ Configuración Final
1. Configurar Credenciales de Base de Datos
Dirígete a la carpeta `backNode`
Abre el archivo `dataBaseCredentials.js`
Configura los datos de conexión:
```javascript
module.exports = {
  host: 'localhost',
  port: 5432,
  database: 'nombre_db',
  user: 'nombre_usuario',
  password: 'tu_contraseña'
};
```
2. Configurar CORS (si es necesario)
Si las conexiones del frontend son rechazadas:
Abre `backNode/index.js`
En la línea 8, modifica la variable `origin` para incluir la URL de tu frontend:
```javascript
const corsOptions = {
  origin: ['http://frontlaravel.test', 'http://localhost:8000', 'tu_url_aquí'],
  // ...
};
```
---
▶️ Ejecución del Proyecto
1. Iniciar el Backend (Node.js)
En la carpeta `backNode`:
```bash
npm start
```
2. Iniciar el Frontend (Laravel)
Según la opción elegida anteriormente:
Herd: Ya está funcionando automáticamente
XAMPP: Asegúrate de que Apache esté corriendo
Artisan: Ejecuta `php artisan serve`
3. Compilar Assets del Frontend
En la carpeta `frontLaravel`:
```bash
npm run dev
```
---
🎉 ¡Listo!
Tu proyecto debería estar funcionando correctamente. Accede a través de:
Herd: `http://frontlaravel.test/`
XAMPP: `http://localhost/frontLaravel/public`
Artisan: `http://127.0.0.1:8000`
---
📝 Comandos Útiles PostgreSQL
Comando	Descripción
`sudo -iu postgres psql`	Conectarse a PostgreSQL
`\l`	Listar bases de datos
`\c nombre_db`	Conectarse a una base de datos
`\dt`	Listar tablas
`\q`	Salir de PostgreSQL
---
🐛 Solución de Problemas
El puerto 8000 está ocupado
```bash
php -S localhost:9000 -t public
```
Error de CORS
Verifica que la URL de tu frontend esté en la lista de orígenes permitidos en `backNode/index.js`.
Error de conexión a PostgreSQL
Verifica que PostgreSQL esté corriendo
Confirma las credenciales en `dataBaseCredentials.js`
Asegúrate de que la base de datos exista
---
📞 Contacto
Si tienes problemas o preguntas, contacta al equipo de desarrollo.
