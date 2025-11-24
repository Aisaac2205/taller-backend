# 🚀 Guía de Inicio Rápido - Taller Backend

## ⚡ Inicio en 5 minutos

### 1. Preparar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env  # o usa tu editor preferido
```

Contenido mínimo de `.env`:
```
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/taller_db
JWT_SECRET=tu-clave-secreta-super-segura-32-caracteres!
JWT_EXPIRATION=24h
FRONTEND_ORIGINS=http://localhost:3000
```

### 2. Crear base de datos

```bash
# PostgreSQL (psql)
createdb taller_db

# O si necesitas usuario y contraseña
createdb -U tu_usuario -h localhost taller_db
```

### 3. Instalar y ejecutar

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo (hot-reload)
pnpm dev

# ✅ Server corriendo en http://localhost:3002
```

## 🔑 Credenciales de prueba

Para crear usuarios iniciales, puedes ejecutar el siguiente seed (próximamente automático):

```sql
INSERT INTO usuarios (id, email, "passwordHash", nombre, rol, activo, "creadoEn", "actualizadoEn")
VALUES (
  'uuid-admin',
  'admin@taller.com',
  'admin123',  -- En producción, usar bcrypt
  'Administrador',
  'admin',
  true,
  NOW(),
  NOW()
);
```

Luego login:
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taller.com","password":"admin123"}'
```

## 📝 Comandos útiles

```bash
# Desarrollo
pnpm dev              # Con hot-reload
pnpm dev:debug       # Con debugger

# Compilación
pnpm build           # Build para producción
pnpm start:prod      # Ejecutar build compilado

# Calidad de código
pnpm lint           # ESLint con auto-fix
pnpm format         # Prettier

# Testing (próximamente)
pnpm test           # Jest unit tests
pnpm test:e2e       # End-to-end tests

# TypeORM (migraciones futuras)
pnpm typeorm:migration:generate -- --name=CreateTablesInitiales
pnpm typeorm:migration:run
```

## 🏗️ Estructura del proyecto

```
src/
├── domain/              # Lógica pura (sin frameworks)
│   ├── entities/       # Clases de dominio
│   ├── services/       # Lógica de negocio
│   └── value-objects/  # Types de valor (Email, Decimal)
│
├── application/         # Orquestación
│   ├── ports/          # Interfaces (contratos)
│   └── use-cases/      # Casos de uso
│
├── infrastructure/      # Implementaciones concretas
│   ├── persistence/    # Repositorios TypeORM
│   ├── http/           # Controllers, DTOs
│   ├── auth/           # JWT, Guards
│   └── schedulers/     # Cron jobs
│
├── config/             # Configuración
├── app.module.ts       # Módulo raíz
└── main.ts            # Punto de entrada
```

## 🔐 Autenticación

**Login:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@taller.com",
  "password": "admin123"
}

Respuesta:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "email": "admin@taller.com",
    "nombre": "Administrador",
    "rol": "admin"
  }
}
```

**Headers para solicitudes protegidas:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 Roles y permisos

| Rol | GET | POST | PATCH | DELETE |
|-----|-----|------|-------|--------|
| admin | ✅ | ✅ | ✅ | ✅ |
| owner | ✅ (reportes) | ❌ | ❌ | ❌ |
| mechanic | ✅ | servicios | servicios | ❌ |
| recepcion | ✅ | clientes, vehículos, ventas | ❌ | ❌ |

## 📊 Endpoints principales

### Autenticación
- `POST /auth/login` - Obtener token
- `GET /auth/me` - Perfil actual

### CRUD
- `GET /clientes` - Listar clientes
- `POST /clientes` - Crear cliente
- `GET /vehiculos` - Listar vehículos
- `GET /productos` - Listar productos

### Transacciones
- `POST /servicios` - Registrar servicio con detalles
- `POST /ventas` - Registrar venta directa
- `POST /recordatorios` - Crear recordatorio

### Reportes
- `GET /inventario/kardex/:productoId` - Historial
- `GET /inventario/productos/estado` - Stock actual

## 🐛 Debugging

```bash
# Con Node debugger
pnpm dev:debug

# En VS Code, agregar a .vscode/launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach NestJS",
      "port": 9229,
      "restart": true
    }
  ]
}
```

## 🚨 Troubleshooting

**Puerto 3000 ya en uso:**
```bash
PORT=3001 pnpm dev
```

**Base de datos no conecta:**
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Test de conexión PostgreSQL
psql postgresql://user:pass@localhost:5432/taller_db -c "SELECT 1"
```

**Hot-reload no funciona:**
```bash
# Limpiar y reinstalar
rm -rf node_modules dist
pnpm install
pnpm dev
```

## 📚 Documentación adicional

- [Arquitectura Hexagonal](/src/README_ARCHITECTURE.md)
- [API Endpoints Detallados](/docs/API.md)
- [Setup Producción](/docs/PRODUCTION.md)
- [Guía de Desarrollo](/docs/DEVELOPMENT.md)

## 💡 Próximos pasos

- [ ] Crear usuario admin en DB
- [ ] Probar endpoints con curl o Postman
- [ ] Crear productos de prueba
- [ ] Registrar clientes y vehículos
- [ ] Hacer un servicio de prueba

¡Happy coding! 🎉

