-- ============================================
-- Script para verificar y corregir nombres de columnas
-- PostgreSQL convierte automáticamente a minúsculas
-- ============================================

-- Verificar estructura actual de todas las tablas
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================
-- Si necesitas renombrar columnas a camelCase (con comillas)
-- Ejecuta estos comandos solo si es necesario
-- ============================================

-- NOTA: PostgreSQL es case-sensitive solo con comillas dobles
-- Si las columnas están en minúsculas, TypeORM debe mapearlas correctamente
-- Ya hemos agregado el mapeo en las entidades TypeORM

-- Para renombrar columnas (si es necesario):
-- ALTER TABLE usuarios RENAME COLUMN "creadoen" TO "creadoEn";
-- ALTER TABLE usuarios RENAME COLUMN "actualizadoen" TO "actualizadoEn";
-- ALTER TABLE usuarios RENAME COLUMN "passwordhash" TO "passwordHash";

-- Pero es mejor mantener las columnas en minúsculas y mapearlas en TypeORM
-- (que es lo que ya hicimos)

