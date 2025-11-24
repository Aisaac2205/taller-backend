import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsuarioTypeormEntity } from '@infrastructure/persistence/typeorm/entities/usuario.typeorm';
import { ClienteTypeormEntity } from '@infrastructure/persistence/typeorm/entities/cliente.typeorm';
import { VehiculoTypeormEntity } from '@infrastructure/persistence/typeorm/entities/vehiculo.typeorm';
import { ProductoTypeormEntity } from '@infrastructure/persistence/typeorm/entities/producto.typeorm';
import { ServicioTypeormEntity } from '@infrastructure/persistence/typeorm/entities/servicio.typeorm';
import { VentaTypeormEntity } from '@infrastructure/persistence/typeorm/entities/venta.typeorm';
import { MovimientoKardexTypeormEntity } from '@infrastructure/persistence/typeorm/entities/movimiento-kardex.typeorm';
import { RecordatorioTypeormEntity } from '@infrastructure/persistence/typeorm/entities/recordatorio.typeorm';

export const getTypeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set'
    );
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [
      UsuarioTypeormEntity,
      ClienteTypeormEntity,
      VehiculoTypeormEntity,
      ProductoTypeormEntity,
      ServicioTypeormEntity,
      VentaTypeormEntity,
      MovimientoKardexTypeormEntity,
      RecordatorioTypeormEntity,
    ],
    synchronize: false, // Nunca usar synchronize en producción
    logging: process.env.NODE_ENV === 'development',
  };
};

