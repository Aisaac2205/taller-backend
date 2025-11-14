# Taller Management System - Backend

Backend del sistema de gestión de taller usando **NestJS + TypeScript** con arquitectura hexagonal (Clean Architecture + Ports & Adapters).

## 🏗️ Arquitectura

```
src/
  domain/                    # Lógica pura de negocio
    entities/               # Entidades del dominio
    value-objects/          # Value Objects (Decimal, Email)
    services/               # Servicios de dominio (sin dependencias de NestJS)
  
  application/              # Capa de aplicación
    ports/                  # Interfaces/contratos
    use-cases/             # Casos de uso orquestadores
  
  infrastructure/           # Implementaciones concretas
    persistence/           # Repositorios (adaptadores de datos)
      typeorm/entities/
      typeorm/repositories/
    http/                  # Controllers, DTOs (adaptadores HTTP)
      controllers/
      dto/
    auth/                  # JWT, Guards, Estrategias
    schedulers/            # Cron jobs
  
  config/                  # Configuración centralizada
  app.module.ts           # Módulo raíz
  main.ts                 # Punto de entrada
```

## ✨ Características

- ✅ **Hexagonal Architecture**: Separación clara de responsabilidades
- ✅ **Domain-Driven Design**: Lógica pura en la capa de dominio
- ✅ **TypeScript Strict**: `noImplicitAny`, `strictNullChecks`, etc.
- ✅ **PostgreSQL + TypeORM**: Base de datos relacional
- ✅ **JWT Authentication**: Con roles y guards
- ✅ **CORS Configurable**: Orígenes desde `.env`
- ✅ **Security Headers**: X-Robots-Tag, X-Frame-Options, etc.
- ✅ **Cron Schedulers**: Tareas automáticas (@nestjs/schedule)
- ✅ **Class Validation**: DTOs validados con class-validator
- ✅ **Value Objects**: Decimal con precisión, Email validado

## 🚀 Instalación y Configuración

### 1. Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/taller_db
JWT_SECRET=tu-secret-key-minimo-32-caracteres-aqui!
JWT_EXPIRATION=24h
FRONTEND_ORIGINS=http://localhost:3001,http://localhost:3002
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Crear base de datos PostgreSQL

```sql
CREATE DATABASE taller_db;
```

### 4. Ejecutar aplicación

**Desarrollo (con hot-reload):**
```bash
pnpm dev
```

**Producción:**
```bash
pnpm build
pnpm start:prod
```

## 📚 Entidades y Relaciones

### Usuarios (Roles)
- `admin`: Control total
- `owner`: Solo lectura de reportes
- `mechanic`: Registrar servicios
- `recepcion`: Registrar clientes, vehículos y ventas

### Productos
- Tipo: ACEITE, FILTRO, OTRO
- Margen de ganancia configurable
- Precio calculado automáticamente
- Control de stock

### Servicios
- Registro con km y descripción
- Detalles de productos usados
- Cálculo automático de costo
- Generación de recordatorio (km/fecha)

### Ventas Directas
- Sin vehículo asociado
- Mismo control de stock que servicios
- Movimientos kardex automáticos

### Recordatorios
- Cambio de aceite automático
- Determinación: ocurre primero (km o fecha)
- Notificaciones pendientes

## 🔌 API Endpoints

### Auth
- `POST /auth/login` - Obtener token JWT
- `GET /auth/me` - Perfil actual

### Clientes
- `GET /clientes` - Listar todos
- `GET /clientes/:id` - Obtener por ID
- `POST /clientes` - Crear (admin, recepcion)
- `PATCH /clientes/:id` - Actualizar
- `DELETE /clientes/:id` - Eliminar (admin)

### Vehículos
- `GET /vehiculos` - Listar
- `GET /vehiculos/:id` - Obtener
- `POST /vehiculos` - Crear
- `PATCH /vehiculos/:id` - Actualizar
- `DELETE /vehiculos/:id` - Eliminar

### Productos
- `GET /productos` - Listar
- `GET /productos/:id` - Obtener
- `POST /productos` - Crear (admin)
- `PATCH /productos/:id` - Actualizar (admin)
- `DELETE /productos/:id` - Eliminar (admin)

### Servicios
- `GET /servicios` - Listar
- `GET /servicios/:id` - Obtener
- `POST /servicios` - Registrar (mechanic, admin)
- `PATCH /servicios/:id/completar` - Completar
- `DELETE /servicios/:id` - Eliminar (admin)

### Ventas
- `GET /ventas` - Listar
- `GET /ventas/:id` - Obtener
- `POST /ventas` - Registrar (recepcion, admin)
- `DELETE /ventas/:id` - Eliminar (admin)

### Inventario
- `GET /inventario/kardex/:productoId` - Historial movimientos
- `GET /inventario/productos/estado` - Estado actual stock

### Recordatorios
- `GET /recordatorios` - Listar
- `GET /recordatorios/pendientes` - Solo pendientes
- `GET /recordatorios/:id` - Obtener
- `PATCH /recordatorios/:id/completar` - Marcar completado
- `DELETE /recordatorios/:id` - Eliminar

## 🔐 Seguridad

- JWT Bearer Token en header `Authorization`
- RolesGuard protegiendo endpoints
- Headers de seguridad automáticos
- Validación de DTOs (class-validator)
- Strict TypeScript mode
- No uso de `any` type

## 🧪 Comandos útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Formatear código
pnpm format

# Linting
pnpm lint

# Ejecutar en producción
pnpm start:prod

# Migraciones TypeORM (cuando tengas migrations)
pnpm typeorm:migration:generate
pnpm typeorm:migration:run
```

## 📦 Dependencias principales

- `@nestjs/common@^10.4.0` - NestJS core
- `@nestjs/typeorm@^10.1.0` - TypeORM integration
- `@nestjs/jwt@^12.0.0` - JWT auth
- `@nestjs/schedule@^4.1.0` - Cron jobs
- `passport-jwt@^4.0.1` - JWT strategy
- `class-validator@^0.14.1` - DTO validation
- `class-transformer@^0.5.1` - DTO transformation
- `pg@^8.12.0` - PostgreSQL driver
- `pdfkit@^0.14.0` - PDF generation
- `typeorm@^0.3.21` - ORM

## 📝 Notas de desarrollo

- Los Value Objects validan en construcción
- Los repositorios mapean entre TypeORM y Domain
- Los Use Cases orquestan la lógica sin lógica de negocio duplicada
- Los Controllers no contienen lógica, solo mapeo request/response
- Toda la lógica pura está en `domain/services`

## 🛠️ Próximos pasos

- [ ] Implementar generación de facturas con PDFKit
- [ ] Agregar filtros avanzados en listados
- [ ] Paginación en endpoints
- [ ] Audit log de cambios
- [ ] Reportes (ventas, servicios, etc.)
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Tests unitarios y e2e
- [ ] API Documentation con Swagger

## 📄 Licencia

MIT

