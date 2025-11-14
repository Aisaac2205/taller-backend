import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (configService: ConfigService) => {
  const frontendOrigins =
    configService.get<string>('FRONTEND_ORIGINS') || '';
  const origins = frontendOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return {
    origin: origins.length > 0 ? origins : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
};

