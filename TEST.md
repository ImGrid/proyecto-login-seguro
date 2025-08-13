# TESTS.md

## Guía de Pruebas Manuales y Automatizadas

### Pruebas Automatizadas (Ver scripts `script1.txt` y `script2.txt`)

#### 1. Manipulación de JWT
- Ejecutar el script para enviar un JWT alterado.
- **Esperado:** El sistema rechaza el token y no otorga acceso.

#### 2. Timing Attacks
- El script compara tiempos de respuesta entre usuarios existentes y no existentes.
- **Esperado:** No debe haber diferencias significativas.

#### 3. Race Conditions
- El script envía múltiples solicitudes concurrentes de login/registro.
- **Esperado:** El sistema responde de forma consistente y no permite duplicados.

#### 4. Parameter Pollution
- El script envía parámetros duplicados.
- **Esperado:** El backend solo procesa el valor permitido y rechaza el resto.

#### 5. Mass Assignment
- El script intenta registrar un usuario con campos administrativos.
- **Esperado:** El usuario no obtiene privilegios elevados.

#### 6. Header Injection
- El script envía headers manipulados.
- **Esperado:** El backend ignora o rechaza headers maliciosos.

#### 7. Business Logic Bypass
- El script intenta registrar varias cuentas con el mismo email simultáneamente.
- **Esperado:** Solo una cuenta debe ser creada.

#### 8. Inyección NoSQL/SQL y XSS
- El script prueba payloads maliciosos en los campos de login.
- **Esperado:** El sistema rechaza los intentos y no ejecuta código malicioso.

#### 9. Buffer Overflow y límites
- El script envía campos con longitudes excesivas.
- **Esperado:** El sistema rechaza entradas fuera de los límites definidos.

#### 10. Bypass de autenticación
- El script prueba credenciales vacías o nulas.
- **Esperado:** El sistema rechaza el acceso.

---

## Ejecución de Pruebas

1. Asegúrate de que el backend esté corriendo en `localhost:3000`.
2. Ejecuta los scripts `script1.txt` y `script2.txt` en un entorno Node.js.
3. Revisa la consola para los resultados de cada prueba.
4. Verifica que todos los ataques sean bloqueados o mitigados según lo esperado.

---

**Nota:** Estas pruebas cubren los principales vectores de ataque identificados. Se recomienda complementar con pruebas manuales adicionales y revisiones periódicas
