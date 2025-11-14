# Backend - GameHub E-commerce

Backend desarrollado con Express.js, MongoDB y autenticación JWT.

# Pendientes

-   [x] Eliminar JSON Server
-   [x] Crear servidor real usando Express
-   [x] Crear esquemas de validacion de datos para Mongoose
-   [x] Incorporar conexion a MongoDB usando Mongoose
-   [x] Crear rutas y logica para gestion de usuarios, de carrito y de productos
-   [x] Añadir autenticacion con JWT y hashing de contraseñas con Bcrypt
-   [x] Gestion de variables de entorno con dotenv
-   [x] Agregar validaciones con express-validator
-   [x] Crear script para poblar base de datos con info inicial

## Características

-   ✅ Autenticación JWT con expiración de 1 hora
-   ✅ Contraseñas hasheadas con bcrypt
-   ✅ Gestión de usuarios (registro y login)
-   ✅ Productos almacenados en MongoDB
-   ✅ Órdenes vinculadas a usuarios
-   ✅ Variables de entorno con dotenv
-   ✅ Validación de datos con express-validator
-   ✅ CORS configurado

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Crear archivo `.env` en la raíz del backend con:

```env
MONGODB_URI=mongodb+srv://xxxxxxx:xxxxxxx@prueba.8ulixbw.mongodb.net/?appName=xxxxx
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion_2025
JWT_EXPIRES_IN=1h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Poblar Base de Datos

Para cargar productos iniciales:

```bash
node scripts/seedProducts.js
```

## Endpoints

### Autenticación

-   `POST /api/auth/register` - Registrar usuario
-   `POST /api/auth/login` - Iniciar sesión
-   `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Productos

-   `GET /api/products` - Obtener todos los productos (público)
-   `GET /api/products/:id` - Obtener producto por ID (público)
-   `POST /api/products` - Crear producto (requiere autenticación)

### Órdenes

-   `POST /api/orders` - Crear orden (requiere autenticación)
-   `GET /api/orders` - Obtener órdenes del usuario (requiere autenticación)
-   `GET /api/orders/:id` - Obtener orden específica (requiere autenticación)

## Seguridad

-   Contraseñas hasheadas con bcrypt (salt rounds: 10)
-   Tokens JWT con expiración de 1 hora
-   Middleware de autenticación en rutas protegidas
-   Validación de datos en todas las rutas
-   CORS configurado para el frontend (local)
