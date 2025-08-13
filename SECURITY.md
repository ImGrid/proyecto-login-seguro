# SECURITY.md

## Riesgos Identificados y Mitigaciones

### 1. Manipulación de JWT
- **Riesgo:** Un atacante puede modificar el token JWT para escalar privilegios.
- **Mitigación:** El backend valida la firma de todos los JWT usando un secreto robusto. Tokens alterados o con firma inválida son rechazados.

### 2. Ataques de fuerza bruta y timing
- **Riesgo:** Un atacante puede adivinar contraseñas o enumerar usuarios midiendo tiempos de respuesta.
- **Mitigación:** Se implementa rate limiting en endpoints críticos y se igualan los tiempos de respuesta para credenciales válidas e inválidas.

### 3. Inyección NoSQL/SQL y XSS
- **Riesgo:** Inyección de operadores o scripts maliciosos en los campos de entrada.
- **Mitigación:** Se validan y sanitizan todas las entradas. Mongoose previene NoSQL injection y se escapan caracteres peligrosos en el frontend.

### 4. Race conditions y lógica de negocio
- **Riesgo:** Condiciones de carrera pueden permitir el registro múltiple con el mismo email o inconsistencias en concurrencia.
- **Mitigación:** Se aplican restricciones de unicidad a nivel de base de datos y se maneja la concurrencia correctamente en el backend.

### 5. Mass Assignment y Parameter Pollution
- **Riesgo:** Un atacante puede enviar campos adicionales (ej. isAdmin) o parámetros duplicados para modificar privilegios.
- **Mitigación:** Solo se procesan los campos permitidos en el backend (whitelisting). Se ignoran parámetros duplicados o inesperados.

### 6. Inyección de headers
- **Riesgo:** Manipulación de headers HTTP para alterar el flujo de la aplicación.
- **Mitigación:** El backend ignora headers inesperados y valida los valores recibidos.

### 7. Buffer overflow y validación de límites
- **Riesgo:** Entradas excesivamente largas pueden causar errores o vulnerabilidades.
- **Mitigación:** Se establecen límites de longitud en los campos de entrada.

---

## Decisiones de Diseño de Seguridad

- **JWT:** Autenticación sin estado, con expiración corta y firma fuerte.
- **Rate limiting:** Protección contra fuerza bruta y automatización.
- **Validación estricta:** Uso de validadores y sanitizadores en backend y frontend.
- **Restricciones de unicidad:** A nivel de base de datos para evitar duplicados.
- **Whitelisting de campos:** Solo se aceptan campos explícitamente permitidos en cada endpoint.

---

## Límites Conocidos / Trabajo Futuro

- **Recuperación de contraseña y verificación de email:** No implementados aún.
- **2FA:** No disponible, recomendable para mayor seguridad.
- **Auditoría y alertas:** No se registran intentos sospechosos de forma centralizada.
- **Despliegue:** Se recomienda usar HTTPS y cookies seguras en producción.

---
