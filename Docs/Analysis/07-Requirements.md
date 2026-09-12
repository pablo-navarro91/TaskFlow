# Requerimientos de TaskFlow

## 1. Introducción

Este documento especifica los requerimientos funcionales y no funcionales de **TaskFlow**, una aplicación web para la gestión personal de tareas.

Los requerimientos se identifican mediante la nomenclatura:

* **RF-XX:** Requerimiento funcional.
* **RNF-XX:** Requerimiento no funcional.

Cada requerimiento funcional se relaciona, cuando corresponde, con casos de uso, endpoints y casos de prueba para mantener la trazabilidad entre análisis, implementación y verificación.

---

# 2. Requerimientos funcionales

## RF-01 — Registro de usuario

**Estado:** Verificado

### Descripción

El sistema deberá permitir que una persona cree una cuenta proporcionando nombre, correo electrónico y contraseña.

### Criterios de aceptación

* El nombre es obligatorio.
* El nombre no podrá superar los 100 caracteres.
* El correo electrónico es obligatorio.
* El correo debe tener un formato válido.
* El correo debe ser único dentro del sistema.
* El correo debe normalizarse antes de almacenarse.
* La contraseña debe contener entre 8 y 72 caracteres.
* La contraseña no deberá almacenarse en texto plano.
* La contraseña deberá almacenarse mediante un hash seguro.
* La API no deberá devolver la contraseña ni su hash como parte de la respuesta de registro.
* Un intento de registro utilizando un correo existente deberá ser rechazado.
* Los campos no contemplados por el DTO deberán ser rechazados.

### Endpoint asociado

`POST /auth/register`

### Caso de uso

`CU-01 — Registrar usuario`

### Casos de prueba asociados

`CP-AUTH-001` a `CP-AUTH-004`.

---

## RF-02 — Inicio de sesión

**Estado:** Verificado

### Descripción

El sistema deberá permitir que un usuario registrado se autentique mediante su correo electrónico y contraseña.

### Criterios de aceptación

* El correo electrónico y la contraseña son obligatorios.
* El correo deberá tener formato válido.
* El correo deberá normalizarse antes de buscar al usuario.
* La contraseña ingresada deberá compararse de forma segura con el hash almacenado.
* Una autenticación válida deberá generar un token JWT.
* El JWT deberá identificar al usuario mediante su identificador.
* Las credenciales incorrectas deberán producir una respuesta HTTP `401 Unauthorized`.
* El sistema no deberá revelar si el error de autenticación fue provocado por un correo inexistente o una contraseña incorrecta.
* La contraseña ni su hash deberán formar parte de la respuesta.

### Endpoint asociado

`POST /auth/login`

### Caso de uso

`CU-02 — Iniciar sesión`

### Casos de prueba asociados

`CP-AUTH-005` a `CP-AUTH-008`.

---

## RF-03 — Acceso a recursos protegidos

**Estado:** Propuesto

### Descripción

El sistema deberá restringir determinados recursos a usuarios autenticados mediante JWT.

### Criterios de aceptación

* El cliente deberá enviar el JWT mediante el encabezado HTTP `Authorization`.
* Se utilizará el esquema `Bearer`.
* El sistema deberá verificar la firma del token.
* El sistema deberá verificar la vigencia del token.
* Las solicitudes sin token deberán ser rechazadas.
* Los tokens inválidos deberán ser rechazados.
* Los tokens expirados deberán ser rechazados.
* Las solicitudes no autorizadas deberán producir HTTP `401 Unauthorized`.
* El sistema deberá poder identificar al usuario autenticado mediante el payload del JWT.
* Los endpoints públicos de registro e inicio de sesión deberán continuar siendo accesibles sin JWT.

### Endpoint inicial de verificación

`GET /auth/profile`

### Casos de prueba previstos

`CP-AUTH-009` a `CP-AUTH-012`.

---

# 3. Requerimientos no funcionales iniciales

## RNF-01 — Seguridad de contraseñas

Las contraseñas deberán almacenarse mediante un algoritmo de hashing seguro. TaskFlow utiliza `bcrypt`.

## RNF-02 — Configuración sensible

Las credenciales de base de datos, secretos JWT y demás información sensible deberán gestionarse mediante variables de entorno y no deberán almacenarse directamente en el repositorio.

## RNF-03 — Validación de entrada

Los datos recibidos por la API deberán validarse antes de llegar a la lógica de negocio.

La aplicación utilizará DTOs y validaciones declarativas para rechazar información inválida o campos no permitidos.

## RNF-04 — Persistencia

La información persistente deberá almacenarse en PostgreSQL.

Los cambios estructurales del esquema deberán gestionarse mediante migraciones de TypeORM.

## RNF-05 — Mantenibilidad

El backend deberá mantener separación de responsabilidades mediante módulos, controladores, servicios, DTOs, entidades y componentes de infraestructura.

## RNF-06 — Verificabilidad

Las funcionalidades críticas deberán disponer de pruebas automatizadas cuando resulte apropiado.

## RNF-07 — Gestión de configuración

La aplicación deberá validar durante su inicialización la existencia y validez básica de las variables de entorno obligatorias.

---

# 4. Estados de los requerimientos

Los requerimientos podrán encontrarse en alguno de los siguientes estados:

**Propuesto:** definido pero todavía no iniciado.

**En desarrollo:** implementación en curso.

**Implementado:** desarrollo finalizado pero pendiente de verificación completa.

**Verificado:** implementación comprobada mediante las pruebas definidas.

---

# 5. Trazabilidad

La trazabilidad general del proyecto seguirá la relación:

`Requerimiento → Caso de uso → Implementación → Caso de prueba → Prueba automatizada`

Esta relación permitirá verificar que las funcionalidades implementadas respondan a necesidades previamente definidas y que puedan comprobarse mediante pruebas reproducibles.
