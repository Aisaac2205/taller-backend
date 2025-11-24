# Scripts de Base de Datos

## Instalación en Railway

### Opción 1: Usando Railway CLI

1. Conecta a tu base de datos PostgreSQL en Railway:
```bash
railway connect
```

2. Ejecuta el script:
```bash
psql $DATABASE_URL -f database/schema.sql
```

### Opción 2: Usando Railway Dashboard

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio de PostgreSQL
3. Ve a la pestaña "Data"
4. Haz clic en "Query"
5. Copia y pega el contenido de `schema.sql`
6. Ejecuta el query

### Opción 3: Usando psql directamente

Si tienes la URL de conexión de Railway:

```bash
psql "postgresql://user:password@host:port/database" -f database/schema.sql
```

## Credenciales por Defecto

**Usuario Administrador:**
- Email: `admin@taller.com`
- Password: `admin123` ⚠️ **Cambiar inmediatamente en producción**

## Estructura de Tablas

El script crea las siguientes tablas:

1. **usuarios** - Usuarios del sistema (admin, owner, mechanic, recepcion)
2. **clientes** - Clientes del taller
3. **vehiculos** - Vehículos de los clientes
4. **productos** - Inventario de productos (aceites, filtros, etc.)
5. **servicios** - Servicios realizados a vehículos
6. **ventas** - Ventas directas de productos
7. **movimientos_kardex** - Movimientos de inventario
8. **recordatorios** - Recordatorios de mantenimiento

## Índices

El script también crea índices en las columnas más consultadas para mejorar el rendimiento.

## Notas de Seguridad

⚠️ **IMPORTANTE**: 
- El password del usuario admin está en texto plano. En producción, debe ser hasheado con bcrypt.
- Cambia las credenciales por defecto inmediatamente después de la instalación.
- No ejecutes este script en producción sin revisar y modificar las credenciales.

## Verificación

Después de ejecutar el script, verifica que todas las tablas se crearon:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver 8 tablas listadas.



