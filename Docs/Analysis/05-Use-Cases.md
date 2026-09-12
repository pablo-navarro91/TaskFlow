# Casos de uso de TaskFlow

## CU-01 — Registrar usuario

**Actor principal:** Usuario no registrado
**Requerimiento asociado:** RF-01
**Estado:** Implementado

### Objetivo

Crear una cuenta en TaskFlow mediante nombre, correo electrónico y contraseña.

### Precondiciones

* El usuario no debe encontrarse autenticado.
* El correo utilizado no debe estar registrado.

### Flujo principal

1. El usuario proporciona nombre, correo electrónico y contraseña.
2. El sistema valida los datos recibidos.
3. El sistema normaliza el correo electrónico.
4. El sistema verifica que el correo no esté registrado.
5. El sistema genera un hash seguro de la contraseña.
6. El sistema almacena el nuevo usuario.
7. El sistema devuelve los datos públicos de la cuenta creada.

### Flujos alternativos

#### A1 — Datos inválidos

1. El usuario proporciona datos que no cumplen las reglas de validación.
2. El sistema rechaza la solicitud.
3. El sistema devuelve HTTP `400 Bad Request`.
4. El usuario no es creado.

#### A2 — Correo registrado

1. El sistema detecta que el correo ya pertenece a una cuenta.
2. El sistema rechaza la solicitud.
3. El sistema devuelve HTTP `409 Conflict`.
4. No se crea un nuevo usuario.

#### A3 — Campo no permitido

1. La solicitud contiene un campo no definido en el DTO.
2. El sistema rechaza la solicitud.
3. El sistema devuelve HTTP `400 Bad Request`.

### Postcondiciones

**Éxito:** existe una nueva cuenta y la contraseña se encuentra almacenada mediante hash.

**Fallo:** no se realizan cambios sobre los usuarios almacenados.

---

## CU-02 — Iniciar sesión

**Actor principal:** Usuario registrado
**Requerimiento asociado:** RF-02
**Estado:** Implementado

### Objetivo

Autenticar al usuario y obtener un token que permita acceder posteriormente a recursos protegidos.

### Precondiciones

* El usuario debe poseer una cuenta registrada.

### Flujo principal

1. El usuario proporciona correo electrónico y contraseña.
2. El sistema valida los datos recibidos.
3. El sistema normaliza el correo.
4. El sistema busca el usuario correspondiente.
5. El sistema compara la contraseña recibida con el hash almacenado.
6. El sistema genera un JWT asociado al usuario.
7. El sistema devuelve el token de acceso.

### Flujo alternativo

#### A1 — Credenciales inválidas

1. El correo no corresponde a un usuario registrado o la contraseña es incorrecta.
2. El sistema rechaza la autenticación.
3. El sistema devuelve HTTP `401 Unauthorized`.
4. El sistema no informa cuál de las credenciales produjo el error.
5. No se genera un token.

### Postcondiciones

**Éxito:** el cliente obtiene un JWT válido.

**Fallo:** no se genera ningún token de acceso.

---

# Próximos casos de uso

Los casos de uso correspondientes al acceso autenticado y a la gestión de tareas se incorporarán a medida que sus requerimientos sean definidos.

No se documentarán como implementados hasta que su desarrollo y verificación hayan finalizado.
