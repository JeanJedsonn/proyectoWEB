Factura:

- FK, Cliente_id
- Titulo_juego
- C, correo
- clave
- precio_venta
- precio_compra
- fecha_venta
- tipo

Cliente:

- id
- C, red : [IG,FB,WS...]
- nombre
- tlf
- correo
- notas

Correo:

- direccion
- clave
- nombres
- cumpleaños
- recuperacion
- redireccion

CuentaJuego:

- id
- FK, Correo_id
- clave
- nickname
- cumpleaños
- semilla
- codigos2AF
- fechaDesactivacion
- C, region
- saldo
- C, direccion {pais,ciudad,codigoPostal}
- C, plataforma
- juegos_comprados []

Opciones: // [id,select,valor]

- id
- Select // Tipo de juego, Plataforma...
- Valor // Nombre del tipo de juego, Nombre de la plataforma...

RedesSociales:

- id
- nombre
- url

Relaciones:

- Factura.Cliente_id -> Cliente.id
- Factura.Correo -> Correo.direccion
- Factura.plataforma -> Opciones.valor
- Factura.juegos_comprados -> Juego.titulo
- Factura.tipo -> Opciones.valor

- CuentaJuego.Correo_id -> Correo.id

NOTAS:

- La factura debe tener la informacion minima para identificar la venta
- La eliminacion de un valor en otra tabla no debe afectar a Factura o
- La eliminacion de un juego no debe afectar a CuentaJuego (en caso se implemente la tabla)

- FK, primary key
- C, copia de otra tabla
