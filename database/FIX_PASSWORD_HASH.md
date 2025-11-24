# Solución: Columna passwordHash no existe

## Problema
La tabla `usuarios` en la base de datos no tiene la columna `passwordHash`, pero el código TypeORM la requiere.

## Solución Rápida

Ejecuta este SQL en tu base de datos de Railway:

```sql
-- Agregar la columna passwordHash si no existe
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS "passwordHash" VARCHAR(255);

-- Si la columna ya existe pero está vacía, actualizar con el password del usuario admin
-- ⚠️ IMPORTANTE: Esto asume que el usuario admin tiene password 'admin123'
-- Si usaste otro password, cámbialo aquí
UPDATE usuarios 
SET "passwordHash" = 'admin123' 
WHERE email = 'admin@taller.com' AND ("passwordHash" IS NULL OR "passwordHash" = '');

-- Verificar que se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios' AND column_name = 'passwordHash';
```

## Pasos en Railway

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio PostgreSQL
3. Ve a la pestaña **"Data"**
4. Haz clic en **"Query"**
5. Copia y pega el SQL de arriba
6. Ejecuta el query

## Verificación

Después de ejecutar el SQL, verifica que la columna existe:

```sql
SELECT * FROM usuarios LIMIT 1;
```

Deberías ver la columna `passwordHash` en los resultados.

## Nota Importante

Si ya creaste el usuario admin con un password diferente, actualiza la línea del UPDATE con el password correcto que usaste al crear el usuario.



