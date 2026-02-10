# 1.¿Qué endpoint has creado y por qué?

He creado un endpoint que hace que veas todos los pokémons que hay en la base de datos de cada generación.

**URL:** `GET /api/pokemon/estadisticas/generaciones`

Lo he hecho porque se necesitaba saber cuántos pokémons hay por cada generació. Esto ayuda a saber si falta alguno o no, ya que te dice el número exacto de pokémons que hay en cada una.

**Arquitectura por capas:**

- **Controlador** (`PokemonController.java`): Recibe la petición GET y llama al servicio.
- **Servicio** (`PokemonService.java`): Contiene el método `contarPorGeneracion()` que recorre las 9 generaciones y pide al repositorio el conteo de cada una.
- **Repositorio** (`PokemonRepository.java`): Tiene el método `countByGeneracion(Integer generacion)` que hace la consulta a la base de datos.


# 2.¿Cómo has implementado la seguridad?

El proyecto usa **JWT** con **Spring Security**. Funciona así:

1. El usuario se registra o inicia sesión en `/api/auth/login` y recibe un token JWT.
2. Ese token se envía en la cabecera `Authorization: Bearer <token>` en cada petición.
3. El filtro `JwtAuthenticationFilter` intercepta las peticiones y valida el token.
4. En `SecurityConfig.java` se definen los permisos:
   - **GET públicos**: Los endpoints de consulta (listar pokémons, tipos) son accesibles sin token.
   - **GET estadísticas**: El endpoint de generaciones requiere rol USER o ADMIN (`hasAnyRole("USER", "ADMIN")`).
   - **POST/PUT**: Requieren rol USER o ADMIN (necesitas estar logueado).
   - **DELETE**: Solo ADMIN puede borrar pokémons.

El endpoint de estadísticas de generaciones está protegido y requiere autenticación JWT con rol USER o ADMIN. Si se accede sin token, devuelve un 403 Forbidden.



# 3.Capturas o comandos para probarlo:

Petición sin token, se obtiene un 403 Forbidden porque el endpoint está protegido:

![alt text](image-2.png)

Petición con token JWT válido, devuelve el conteo de pokémons por generación correctamente:

![alt text](image-3.png)


Aquí se puede verAuthorization con el Bearer token y la respuesta 200 OK con el JSON de generaciones:

![alt text](image-4.png)










