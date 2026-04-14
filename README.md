# Proyecto Web

### Alumnos

- Jeanmarco Alarcon: 27.117.926
- Luigi Quero: 30.009.785
- Gabriel Rodríguez 30.172.571

# Requisitos Previos (Laravel)

Este documento detalla los pasos necesarios para configurar el entorno local y desplegar el proyecto correctamente.

### Clonar o Descargar el Proyecto

[https://github.com/JeanJedsonn/taller3](https://github.com/JeanJedsonn/taller3)

# Guía de Instalación - Con HERD

Ubica el proyecto en tu directorio de trabajo (por ejemplo, dentro de la carpeta `Herd` que crea el instalador).

### 1. Laravel Herd (Recomendado para Windows):

Descarga e instala Herd desde: [https://herd.laravel.com/windows](https://herd.laravel.com/windows).
_Herd instalará automáticamente PHP, Composer y configurará un servidor web local._

## Pasos para la Instalación

### 2. Instalación de Dependencias de PHP

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
composer install
```

### 3. Vincular el Proyecto en Herd

- Abre el panel de **Herd** .
- Ve a la sección **Sites** .
- Utiliza la opción **"Link existing project"** y selecciona la carpeta raíz de este proyecto.
- Ahora podrás acceder desde el navegador (ej: `http://frontlaravel.test/`) (**Herd** indicara la url).

# Guía de Instalación - Con XAMPP

**1.** Si no lo tienes, descárgalo en: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)

**2.** Mueve la carpeta del proyecto a **`C:\xampp\htdocs\frontLaravel`**.

**3.** Inicia los servicios de \***\*Apache\*\*** en el Panel de Control de XAMPP.

**4.** El sitio será accesible en: **`http://localhost/frontLaravel/public`**.

Una vez elegido el servidor, abre una terminal en la carpeta raíz del proyecto y sigue estos comandos

```
composer install
```

# Guía de Instalación - Con artisan

**1.** Abre una terminal en la raíz del proyecto.

**2.** Asegúrate de tener PHP en tu variable de entorno **`PATH`**.

**3.** Ejecuta el comando:

```
composer install
```

```
php artisan serve
```

En caso de fallar por tener los puertos ocupados o con la direccion de PHP mal configurada, usar

```
php -S localhost:8000 -t public
```

**4.** El sitio será accesible en: `http://127.0.0.1:8000`

# Requisitos Previos (Node)

Basta con la ejecucion de los siguientes comandos en la carpeta `\backNode`

1. ```
   npm install
   ```

Y la ejecucion adicional en la carpeta `\frontLaravel` el comando `npm run dev`

NOTA: npm run start puede fallar en este paso si PostGresql no esta presente en el equipo

# Instalacion de la base de datos (PostGresql)

1. Descargar el installador de postgresql desde [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Ingresar y anotar la contraseña
3. Configurar la DB si se desea especificar datos para el proyecto

# Configuracion previa a la ejecucion

### Conexion a la base de datos

1. Una vez instalada la base de datos, dirijirse a la carpeta backNote
1. Abrir el archivo dataBaseCredentials.js para su edicion
1. Configurar los datos de conexion con los generados durante la instalacion de PostGresql o los personalizados para usar una DB especifica

### Acceso al back

Si las conexiones del front son rechazadas, debe configurarse el back:

1. Dirigirse al directorio backNote
2. Abrir el archivo index.js
3. En la 8va linea, la variable "origin" contiene la lista de url permitidas, agregar la url donde se originan las consultas (las vistas)

### Ejecucion del proyecto

* En la carpeta backNode, ejecutar los comandos

  ```
  npm start
  ```
* En la carpeta frontLaravel, ejecutar el proyecto segun las guinas anteriores (HERD, XAMP o Artisan)
* Ejecutar el siguiente comando
* ```
  npm run dev
  ```

### Instrucciones extra

**Comando para entrar en psql:**
sudo -iu postgres psql

**Comandos para crear db en psql:**
CREATE DATABASE nombre_db;

**Comandos opcionales en psql(si se va a usar un usuario distinto al súper usuario):**
CREATE USER nombre_usuario WITH PASSWORD 'contraseña';
GRANT ALL PRIVILEGES ON DATABASE nombre_db TO nombre_usuario;
GRANT CREATE, USAGE ON SCHEMA public TO nombre_usuario;

**Comando para entrar en psql:**
sudo -iu postgres psql

**Comandos para crear db en psql:**
CREATE DATABASE nombre_db;

**Comandos opcionales en psql(si se va a usar un usuario distinto al súper usuario):**
CREATE USER nombre_usuario WITH PASSWORD 'contraseña';
GRANT ALL PRIVILEGES ON DATABASE nombre_db TO nombre_usuario;
GRANT CREATE, USAGE ON SCHEMA public TO nombre_usuario;
