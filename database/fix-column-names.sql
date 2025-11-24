-- ============================================
-- Script para eliminar columna duplicada passwordHash
-- y asegurar que todas las columnas estén en minúsculas
-- ============================================

-- Eliminar la columna passwordHash duplicada (si existe)
-- Mantener solo passwordhash (minúsculas)
DO $$
BEGIN
    -- Si existe passwordHash (camelCase), eliminar después de copiar datos
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'passwordHash'
    ) THEN
        -- Copiar datos de passwordHash a passwordhash si passwordhash está vacío
        UPDATE usuarios 
        SET passwordhash = "passwordHash"
        WHERE (passwordhash IS NULL OR passwordhash = '') 
        AND "passwordHash" IS NOT NULL 
        AND "passwordHash" != '';
        
        -- Eliminar la columna duplicada
        ALTER TABLE usuarios DROP COLUMN IF EXISTS "passwordHash";
        
        RAISE NOTICE 'Columna passwordHash duplicada eliminada';
    END IF;
END $$;

-- Verificar estructura final
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

