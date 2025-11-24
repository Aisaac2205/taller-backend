-- ============================================
-- Script para corregir la tabla usuarios
-- Agrega la columna passwordHash si no existe
-- ============================================

-- Verificar y agregar la columna passwordHash si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'passwordHash'
    ) THEN
        ALTER TABLE usuarios 
        ADD COLUMN "passwordHash" VARCHAR(255) NOT NULL DEFAULT '';
        
        -- Si ya hay usuarios, actualizar con un valor por defecto
        -- ⚠️ IMPORTANTE: Cambia estos valores después
        UPDATE usuarios 
        SET "passwordHash" = 'admin123' 
        WHERE "passwordHash" = '' OR "passwordHash" IS NULL;
        
        RAISE NOTICE 'Columna passwordHash agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna passwordHash ya existe';
    END IF;
END $$;

-- Verificar la estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;



