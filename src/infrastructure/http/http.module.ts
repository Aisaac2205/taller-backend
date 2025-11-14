import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { ClientesController } from './controllers/clientes.controller';
import { VehiculosController } from './controllers/vehiculos.controller';
import { ProductosController } from './controllers/productos.controller';
import { ServiciosController } from './controllers/servicios.controller';
import { VentasController } from './controllers/ventas.controller';
import { InventarioController } from './controllers/inventario.controller';
import { RecordatoriosController } from './controllers/recordatorios.controller';
import { PersistenceModule } from '@infrastructure/persistence/persistence.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        
        if (!secret || secret.length < 32) {
          throw new Error(
            'JWT_SECRET debe estar configurado en las variables de entorno y tener al menos 32 caracteres'
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn: '24h', // 24 horas
            algorithm: 'HS256', // Algoritmo seguro
            issuer: 'taller-api', // Emisor del token
            audience: 'taller-client', // Audiencia del token
          },
        };
      },
      inject: [ConfigService],
    }),
    PersistenceModule,
  ],
  controllers: [
    AuthController,
    ClientesController,
    VehiculosController,
    ProductosController,
    ServiciosController,
    VentasController,
    InventarioController,
    RecordatoriosController,
  ],
  providers: [JwtStrategy],
})
export class HttpModule {}

