# Guía de Actualización de README - Proyectos Pares

## Resumen de Cambios Implementados

Durante el proceso de implementación del patrón User + Profile, se realizaron los siguientes cambios en el código que deben reflejarse en los README:

### 1. AuthService.login()
- **Antes:** Devolvía solo datos básicos del User
- **Ahora:** Devuelve User + Profile merged, incluyendo profileId, profileCreatedAt, profileUpdatedAt

### 2. AuthService.getProfile()
- **Antes:** Devolvía solo datos del User
- **Ahora:** Devuelve User + Profile merged

### 3. Profile Controllers /me endpoint
- **Antes:** Usaba `findByUserId()`
- **Ahora:** Usa `findOrCreateByUserId()` que crea un profile con valores por defecto si no existe

---

## Actualizaciones por Sección del README

### SECCIÓN 1: Login Response (buscar "#### Iniciar Sesión")

**Reemplazar desde:**
```markdown
#### Iniciar Sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "CLIENTE"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
```

**Reemplazar con:**
```markdown
#### Iniciar Sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (User + Profile merged):**

**🔹 IMPORTANTE:** El endpoint de login ahora devuelve los datos del User combinados con los datos del Profile correspondiente.

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "CLIENTE",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    
    "nombre": "Juan Pérez",
    "telefono": "+51 987654321",
    "direccion": "Av. Principal 123",
    
    "profileId": "507f1f77bcf86cd799439012",
    "profileCreatedAt": "2024-01-01T00:00:00.000Z",
    "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Nota:** Los campos específicos del profile varían según el rol del usuario.
```

---

### SECCIÓN 2: GET /auth/profile (buscar "#### Obtener Información del Usuario Autenticado")

**Reemplazar desde:**
```markdown
#### Obtener Información del Usuario Autenticado
```bash
GET /api/auth/profile
Authorization: Bearer {access_token}
```

```bash
Authorization: Bearer {access_token}
```
```

**Reemplazar con:**
```markdown
#### Obtener Información del Usuario Autenticado
```bash
GET /api/auth/profile
Authorization: Bearer {access_token}
```

**Respuesta exitosa (User + Profile merged):**

**🔹 IMPORTANTE:** Este endpoint devuelve los datos del User combinados con los datos del Profile.

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "usuario@example.com",
  "role": "CLIENTE",
  "isActive": true,
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  
  "nombre": "Juan Pérez",
  "telefono": "+51 987654321",
  "direccion": "Av. Principal 123",
  
  "profileId": "507f1f77bcf86cd799439012",
  "profileCreatedAt": "2024-01-01T00:00:00.000Z",
  "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Nota:** Los campos específicos del profile varían según el rol del usuario.
```

---

### SECCIÓN 3: Profile /me endpoints (buscar "#### Obtener mi perfil" en cada Profile section)

**Agregar después de:**
```bash
GET /api/{profile-name}/me
Authorization: Bearer {token}
```

**Agregar esta nota:**
```markdown
**🔹 NOTA IMPORTANTE:** Este endpoint usa `findOrCreateByUserId()`, lo que significa que:
- Si el usuario ya tiene un profile, lo devuelve
- Si el usuario NO tiene un profile, se crea automáticamente uno con valores por defecto

Esto garantiza que todo usuario autenticado siempre tenga acceso a su profile.
```

---

## Proyectos y sus Configuraciones Específicas

### agroverde-api
- **Roles:** CLIENTE, PRODUCTOR
- **Profiles:** ClienteProfile, ProductorProfile
- **Puerto:** 3011
- **Campos CLIENTE:** nombre, telefono, direccion, preferencias, ubicacion
- **Campos PRODUCTOR:** nombreNegocio, nombreContacto, telefono, direccion, descripcion, certificaciones, categorias

### aulaplus-api
- **Roles:** ESTUDIANTE, PROFESOR
- **Profiles:** EstudianteProfile, ProfesorProfile
- **Puerto:** 3015
- **Campos ESTUDIANTE:** nombre, telefono, grado, seccion
- **Campos PROFESOR:** nombreCompleto, telefono, especialidad, experiencia

### cineplus-api
- **Roles:** USUARIO
- **Profiles:** UsuarioProfile
- **Puerto:** 3010
- **Campos USUARIO:** nombre, telefono, preferencias, historialVisto

### educultura-api
- **Roles:** ESTUDIANTE, INSTRUCTOR
- **Profiles:** EstudianteProfile, InstructorProfile
- **Puerto:** 3012
- **Campos ESTUDIANTE:** nombre, telefono, intereses
- **Campos INSTRUCTOR:** nombreCompleto, telefono, especialidad, biografia

### fitlife-api
- **Roles:** USUARIO, ENTRENADOR
- **Profiles:** UsuarioProfile, EntrenadorProfile
- **Puerto:** 3013
- **Campos USUARIO:** nombre, telefono, edad, peso, altura, objetivos
- **Campos ENTRENADOR:** nombreCompleto, telefono, especialidad, certificaciones, experiencia

### mobilitygreen-api
- **Roles:** USUARIO
- **Profiles:** UsuarioProfile
- **Puerto:** 3014
- **Campos USUARIO:** nombre, telefono, direccion, licenciaConducir, metodoPago

### perfulandia-api
- **Roles:** CLIENTE
- **Profiles:** ClienteProfile
- **Puerto:** 3016
- **Campos CLIENTE:** nombre, telefono, direccion, preferencias

### reciclaapp-api
- **Roles:** USUARIO
- **Profiles:** UsuarioProfile
- **Puerto:** 3017
- **Campos USUARIO:** nombre, telefono, direccion, puntos

### saborlocal-api
- **Roles:** CLIENTE, PRODUCTOR
- **Profiles:** ClienteProfile, ProductorProfile
- **Puerto:** 3018
- **Campos CLIENTE:** nombre, telefono, direccion, preferencias, ubicacion
- **Campos PRODUCTOR:** nombreNegocio, nombreContacto, telefono, direccion, descripcion, certificaciones, categorias

### travelgo-api
- **Roles:** CLIENTE
- **Profiles:** ClienteProfile
- **Puerto:** 3019
- **Campos CLIENTE:** nombre, telefono, direccion, documentoIdentidad, preferencias

---

## Instrucciones de Aplicación

### Opción 1: Manual (Recomendado para revisión)
1. Abrir el README de cada proyecto
2. Buscar las secciones mencionadas arriba
3. Reemplazar con el nuevo contenido adaptando los campos según el proyecto

### Opción 2: Script Automático (Próximamente)
Crear un script que haga los reemplazos automáticamente considerando las variaciones de cada proyecto.

---

## Checklist de Actualización

- [ ] agroverde-api - Secciones: Login, getProfile, ClienteProfile/me, ProductorProfile/me
- [ ] aulaplus-api - Secciones: Login, getProfile, EstudianteProfile/me, ProfesorProfile/me
- [ ] cineplus-api - Secciones: Login, getProfile, UsuarioProfile/me
- [ ] educultura-api - Secciones: Login, getProfile, EstudianteProfile/me, InstructorProfile/me
- [ ] fitlife-api - Secciones: Login, getProfile, UsuarioProfile/me, EntrenadorProfile/me
- [ ] mobilitygreen-api - Secciones: Login, getProfile, UsuarioProfile/me
- [ ] perfulandia-api - Secciones: Login, getProfile, ClienteProfile/me
- [ ] reciclaapp-api - Secciones: Login, getProfile, UsuarioProfile/me
- [ ] saborlocal-api - Secciones: Login, getProfile, ClienteProfile/me, ProductorProfile/me
- [ ] travelgo-api - Secciones: Login, getProfile, ClienteProfile/me

---

## Ejemplos Completos por Proyecto

### Ejemplo: cineplus-api (1 rol)

**Login Response para USUARIO:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@cineplus.com",
    "role": "USUARIO",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    
    "nombre": "Juan Pérez",
    "telefono": "+51 987654321",
    "preferencias": ["accion", "comedia"],
    "historialVisto": ["tt0111161", "tt0068646"],
    
    "profileId": "507f1f77bcf86cd799439012",
    "profileCreatedAt": "2024-01-01T00:00:00.000Z",
    "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ejemplo: agroverde-api (2 roles)

**Login Response para CLIENTE:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "cliente@agroverde.com",
    "role": "CLIENTE",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    
    "nombre": "Juan Pérez",
    "telefono": "+51 987654321",
    "direccion": "Av. Principal 123",
    "preferencias": ["organico", "local"],
    "ubicacion": {
      "type": "Point",
      "coordinates": [-77.0428, -12.0464]
    },
    
    "profileId": "507f1f77bcf86cd799439012",
    "profileCreatedAt": "2024-01-01T00:00:00.000Z",
    "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Login Response para PRODUCTOR:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "productor@agroverde.com",
    "role": "PRODUCTOR",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    
    "nombreNegocio": "Frutas del Valle",
    "nombreContacto": "María García",
    "telefono": "+51 987654321",
    "direccion": "Fundo La Esperanza",
    "descripcion": "Productores de frutas orgánicas",
    "certificaciones": ["organico", "comercio-justo"],
    "categorias": ["frutas", "verduras"],
    "ubicacion": {
      "type": "Point",
      "coordinates": [-77.0428, -12.0464]
    },
    
    "profileId": "507f1f77bcf86cd799439012",
    "profileCreatedAt": "2024-01-01T00:00:00.000Z",
    "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

**Generado:** 2025-12-03
**Aplica a:** Proyectos pares (2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
