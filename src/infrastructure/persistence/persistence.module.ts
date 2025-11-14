import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsuarioTypeormEntity } from './typeorm/entities/usuario.typeorm';
import { ClienteTypeormEntity } from './typeorm/entities/cliente.typeorm';
import { VehiculoTypeormEntity } from './typeorm/entities/vehiculo.typeorm';
import { ProductoTypeormEntity } from './typeorm/entities/producto.typeorm';
import { ServicioTypeormEntity } from './typeorm/entities/servicio.typeorm';
import { VentaTypeormEntity } from './typeorm/entities/venta.typeorm';
import { MovimientoKardexTypeormEntity } from './typeorm/entities/movimiento-kardex.typeorm';
import { RecordatorioTypeormEntity } from './typeorm/entities/recordatorio.typeorm';
import { UsuarioRepository } from './typeorm/repositories/usuario.repository';
import { ClienteRepository } from './typeorm/repositories/cliente.repository';
import { VehiculoRepository } from './typeorm/repositories/vehiculo.repository';
import { ProductoRepository } from './typeorm/repositories/producto.repository';
import { ServicioRepository } from './typeorm/repositories/servicio.repository';
import { VentaRepository } from './typeorm/repositories/venta.repository';
import { MovimientoKardexRepository } from './typeorm/repositories/movimiento-kardex.repository';
import { RecordatorioRepository } from './typeorm/repositories/recordatorio.repository';
import { getTypeOrmConfig } from '@/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UsuarioTypeormEntity,
      ClienteTypeormEntity,
      VehiculoTypeormEntity,
      ProductoTypeormEntity,
      ServicioTypeormEntity,
      VentaTypeormEntity,
      MovimientoKardexTypeormEntity,
      RecordatorioTypeormEntity,
    ]),
  ],
  providers: [
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioRepository,
    },
    {
      provide: 'IClienteRepository',
      useClass: ClienteRepository,
    },
    {
      provide: 'IVehiculoRepository',
      useClass: VehiculoRepository,
    },
    {
      provide: 'IProductoRepository',
      useClass: ProductoRepository,
    },
    {
      provide: 'IServicioRepository',
      useClass: ServicioRepository,
    },
    {
      provide: 'IVentaRepository',
      useClass: VentaRepository,
    },
    {
      provide: 'IMovimientoKardexRepository',
      useClass: MovimientoKardexRepository,
    },
    {
      provide: 'IRecordatorioRepository',
      useClass: RecordatorioRepository,
    },
  ],
  exports: [
    'IUsuarioRepository',
    'IClienteRepository',
    'IVehiculoRepository',
    'IProductoRepository',
    'IServicioRepository',
    'IVentaRepository',
    'IMovimientoKardexRepository',
    'IRecordatorioRepository',
  ],
})
export class PersistenceModule {}

