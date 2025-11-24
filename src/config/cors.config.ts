import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (configService: ConfigService) => {
  const frontendOrigins =
    configService.get<string>('FRONTEND_ORIGINS') || '';
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  
  const origins = frontendOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  // Si no hay orígenes configurados, en desarrollo permitir todos
  // En producción, si no está configurado, usar '*' como fallback temporal
  // pero mostrar warning
  let allowedOrigins: string[] | string = origins.length > 0 
    ? origins 
    : '*';

  // Log para debugging
  console.log('CORS Configuration:', {
    nodeEnv,
    frontendOrigins: frontendOrigins || '(not set)',
    allowedOrigins: Array.isArray(allowedOrigins) 
      ? allowedOrigins.join(', ') 
      : allowedOrigins,
    originCount: origins.length,
  });

  if (nodeEnv === 'production' && origins.length === 0) {
    console.warn('WARNING: FRONTEND_ORIGINS no esta configurado en produccion. Usando "*" como fallback.');
  }

  return {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
};

