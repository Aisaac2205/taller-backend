# Configuración Segura de JWT

## Generación de JWT_SECRET

Para generar un secreto JWT seguro, ejecuta uno de los siguientes comandos:

### Opción 1: Usando OpenSSL (Recomendado)
```bash
openssl rand -base64 32
```

### Opción 2: Usando Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Opción 3: Usando PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Configuración

1. Copia el valor generado
2. Crea un archivo `.env` en la raíz del proyecto `backend/`
3. Agrega la siguiente línea:
   ```
   JWT_SECRET=tu-secreto-generado-aqui
   ```

**IMPORTANTE:**
- El secreto debe tener al menos 32 caracteres
- Nunca compartas el secreto en repositorios públicos
- Usa diferentes secretos para desarrollo, staging y producción
- Rota el secreto periódicamente en producción

## Características de Seguridad Implementadas

✅ **Algoritmo seguro**: HS256 (HMAC-SHA256)
✅ **Expiración**: 24 horas
✅ **Validación de campos**: Verifica que el payload contenga todos los campos requeridos
✅ **Validación de expiración**: Rechaza tokens expirados
✅ **Issuer y Audience**: Valida el emisor y audiencia del token
✅ **Validación de usuario activo**: Solo usuarios activos pueden obtener tokens
✅ **Manejo de errores**: Usa excepciones HTTP apropiadas (UnauthorizedException, NotFoundException)

## Estructura del Token

El JWT contiene:
- `sub`: ID del usuario
- `email`: Email del usuario
- `rol`: Rol del usuario (admin, owner, mechanic, recepcion)
- `iat`: Fecha de emisión (timestamp)
- `exp`: Fecha de expiración (timestamp)
- `iss`: Emisor (taller-api)
- `aud`: Audiencia (taller-client)


