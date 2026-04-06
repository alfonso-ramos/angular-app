# Backend API Express con Prisma

API REST construida con Node.js, Express y Prisma ORM para gestión de usuarios, alumnos y profesores.

## Requisitos Previos

- Node.js (v18 o superior)
- MariaDB/MySQL
- npm o bun

## Configuración

1. Clonar el repositorio:
```bash
git clone <repository-url>
```

2. Instalar dependencias:
```bash
npm install
# o con bun
bun install
```

3. Configurar variables de entorno:
```bash
cp .env.template .env
```

Editar el archivo `.env` con las siguientes variables:
```
DATABASE_URL=mysql://usuario:password@localhost:3306/nombre_base_de_datos
JWT_SECRET=tu_secreto_jwt_aqui
```

4. Configurar base de datos:
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

## Ejecución

### Modo Desarrollo
```bash
npm run dev
# o con bun
bun run dev
```
La API se ejecutará en `http://localhost:3000`

### Modo Producción
```bash
npm start
# o con bun
bun start
```

## Documentación API

Una vez iniciado el servidor, accede a la documentación Swagger en:
`http://localhost:3000/api-docs`

## Endpoints Principales

- **Autenticación**: `/auth`
- **Usuarios**: `/api/users`
- **Alumnos**: `/api/alumnos`
- **Profesores**: `/api/profesores`

## Estructura del Proyecto

```
src/
├── config/         # Configuración de Prisma y Swagger
├── controllers/    # Lógica de negocio
├── middlewares/    # Middlewares de autenticación y validación
├── routes/         # Definición de rutas
└── app.js          # Configuración principal de Express
```

## Tecnologías Utilizadas

- Node.js con Express
- Prisma ORM
- MariaDB/MySQL
- JWT para autenticación
- Swagger para documentación
- Express Validator para validación de datos
