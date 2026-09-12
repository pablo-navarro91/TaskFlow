# Casos de prueba de TaskFlow

## 1. Convenciones

Los casos de prueba utilizan la nomenclatura:

`CP-[MÓDULO]-[NÚMERO]`

Por ejemplo:

`CP-AUTH-001`

Estados posibles:

* Pendiente
* Manual
* Automatizado
* Verificado

---

# RF-01 — Registro de usuario

## CP-AUTH-001 — Registrar un usuario correctamente

**Requerimiento:** RF-01
**Tipo:** Unitario / Manual API
**Estado:** Verificado

### Precondición

El correo utilizado no se encuentra registrado.

### Entrada

`POST /auth/register`

```json
{
  "name": "Pablo",
  "email": "pablo@example.com",
  "password": "TaskFlow123!"
}
```

### Resultado esperado

* HTTP `201 Created`.
* El usuario es creado.
* La contraseña se almacena mediante hash.
* La respuesta no contiene la contraseña.

### Automatización relacionada

`src/auth/auth.service.spec.ts`

---

## CP-AUTH-002 — Intentar registrar un correo existente

**Requerimiento:** RF-01
**Tipo:** Unitario / Manual API
**Estado:** Verificado

### Precondición

Existe una cuenta con el correo utilizado.

### Resultado esperado

* HTTP `409 Conflict`.
* No se crea un segundo usuario.
* Se informa que el correo ya se encuentra registrado.

### Automatización relacionada

`src/auth/auth.service.spec.ts`

---

## CP-AUTH-003 — Registrar usuario con datos inválidos

**Requerimiento:** RF-01
**Tipo:** Manual API
**Estado:** Verificado

### Ejemplos

* Correo con formato inválido.
* Contraseña con menos de 8 caracteres.
* Nombre vacío.

### Resultado esperado

HTTP `400 Bad Request`.

---

## CP-AUTH-004 — Enviar campos no permitidos durante el registro

**Requerimiento:** RF-01
**Tipo:** Manual API
**Estado:** Verificado

### Ejemplo

```json
{
  "name": "Pablo",
  "email": "pablo@example.com",
  "password": "TaskFlow123!",
  "isAdmin": true
}
```

### Resultado esperado

HTTP `400 Bad Request`.

El campo adicional deberá ser rechazado por la validación global.

---

# RF-02 — Inicio de sesión

## CP-AUTH-005 — Iniciar sesión con credenciales válidas

**Requerimiento:** RF-02
**Tipo:** Unitario / Manual API
**Estado:** Verificado

### Precondición

Existe una cuenta registrada con las credenciales utilizadas.

### Entrada

`POST /auth/login`

```json
{
  "email": "pablo@example.com",
  "password": "TaskFlow123!"
}
```

### Resultado esperado

* La autenticación es aceptada.
* Se genera un JWT.
* La respuesta contiene `accessToken`.
* La contraseña no forma parte de la respuesta.

### Automatización relacionada

`src/auth/auth.service.spec.ts`

---

## CP-AUTH-006 — Intentar iniciar sesión con usuario inexistente

**Requerimiento:** RF-02
**Tipo:** Unitario
**Estado:** Verificado

### Resultado esperado

* HTTP `401 Unauthorized`.
* No se genera un JWT.
* La respuesta no permite determinar que el correo no existe.

### Automatización relacionada

`src/auth/auth.service.spec.ts`

---

## CP-AUTH-007 — Intentar iniciar sesión con contraseña incorrecta

**Requerimiento:** RF-02
**Tipo:** Unitario
**Estado:** Verificado

### Resultado esperado

* HTTP `401 Unauthorized`.
* No se genera un JWT.
* La respuesta no revela que específicamente la contraseña es incorrecta.

### Automatización relacionada

`src/auth/auth.service.spec.ts`

---

## CP-AUTH-008 — Normalizar correo durante el inicio de sesión

**Requerimiento:** RF-02
**Tipo:** Unitario
**Estado:** Verificado

### Entrada de ejemplo

`"  PABLO@EXAMPLE.COM  "`

### Resultado esperado

El sistema realiza la búsqueda utilizando:

`"pablo@example.com"`

### Automatización relacionada

`src/auth/guards/jwt-auth.guard.spec.ts`

---

# RF-03 — Acceso a recursos protegidos

Los siguientes casos se encuentran definidos pero pendientes de implementación.

## CP-AUTH-009 — Acceder a recurso protegido con token válido

**Requerimiento:** RF-03
**Estado:** Verificado

### Resultado esperado

* El JWT es validado.
* La solicitud continúa.
* El usuario autenticado puede ser identificado.
* HTTP `200 OK`.

---

## CP-AUTH-010 — Acceder a recurso protegido sin token

**Requerimiento:** RF-03
**Estado:** Verificado

### Resultado esperado

HTTP `401 Unauthorized`.

---

## CP-AUTH-011 — Acceder con token inválido

**Requerimiento:** RF-03
**Estado:** Verificado

### Resultado esperado

HTTP `401 Unauthorized`.

---

## CP-AUTH-012 — Acceder con token expirado

**Requerimiento:** RF-03
**Tipo:** Unitario  
**Estado:** Verificado

### Observación

La prueba unitaria verifica que el guard rechace la solicitud cuando
`JwtService` informa que el token no es válido debido a su expiración.

La validación con un JWT realmente expirado se incorporará posteriormente
en las pruebas E2E.

### Resultado esperado

HTTP `401 Unauthorized`.

---

# Matriz de trazabilidad

| Requerimiento | Caso de uso | Casos de prueba           | Estado     |
| ------------- | ----------- | ------------------------- | ---------- |
| RF-01         | CU-01       | CP-AUTH-001 — CP-AUTH-004 | Verificado |
| RF-02         | CU-02       | CP-AUTH-005 — CP-AUTH-008 | Verificado |
| RF-03         | Pendiente   | CP-AUTH-009 — CP-AUTH-012 | Propuesto  |
