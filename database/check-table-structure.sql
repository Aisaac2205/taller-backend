-- ============================================
-- Script para verificar la estructura de la tabla usuarios
-- ============================================

-- Ver todas las columnas de la tabla usuarios
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- Ver los datos actuales (sin mostrar passwordHash por seguridad)
SELECT 
    id,
    email,
    nombre,
    rol,
    activo,
    "creadoEn",
    "actualizadoEn"
FROM usuarios
LIMIT 5;



