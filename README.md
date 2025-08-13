# Proyecto Login Seguro

Sistema completo de autenticación de usuarios con frontend y backend, desarrollado en equipo. Permite el registro, inicio de sesión y gestión segura de sesiones de usuario, implementando buenas prácticas de seguridad y protección contra ataques comunes.

## Características

- Registro y login de usuarios con validación robusta.
- Almacenamiento seguro de contraseñas (hashing y salting).
- Protección contra ataques de fuerza bruta y rate limiting.
- Gestión de sesiones mediante JWT.
- Interfaz moderna y responsiva con React.
- Backend seguro con Node.js, Express y MongoDB.

## Tecnologías Utilizadas

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB (Mongoose)
- **Seguridad:** JWT, Helmet, Express Rate Limit, Bcrypt

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- npm o yarn
- MongoDB en ejecución local o en la nube

## Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-login-seguro.git
cd proyecto-login-seguro
```

### 2. Configuración del Backend

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` y configura las variables necesarias, por ejemplo:

```
MONGO_URI=mongodb://localhost:27017/login_secure
JWT_SECRET=tu_clave_secreta_segura
PORT=3000
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor backend:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000/api`.

### 3. Configuración del Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Inicia la aplicación frontend:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

## Uso

1. Accede a `http://localhost:5173` en tu navegador.
2. Regístrate con un correo y contraseña segura.
3. Inicia sesión para acceder al panel de usuario.
4. Puedes cerrar sesión desde el panel.

## Estructura del Proyecto

```
proyecto-login-seguro/
│
├── backend/      # Código del servidor (API REST)
│
└── frontend/     # Aplicación React (cliente)
```

## Seguridad

- Contraseñas cifradas con bcrypt.
- JWT para autenticación y autorización.
- Rate limiting en rutas sensibles.
- Validación y sanitización de entradas.
- Helmet para cabeceras de seguridad.

## Contribución

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.

---
Desarrollado por el equipo
