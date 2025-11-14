import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehiculoEntity } from '@domain/entities/vehiculo.entity';
import { IVehiculoRepository } from '@application/ports/vehiculo.repository';
import { VehiculoTypeormEntity } from '../entities/vehiculo.typeorm';

@Injectable()
export class VehiculoRepository implements IVehiculoRepository {
  constructor(
    @InjectRepository(VehiculoTypeormEntity)
    private readonly vehiculoDb: Repository<VehiculoTypeormEntity>
  ) {}

  async crear(vehiculo: VehiculoEntity): Promise<VehiculoEntity> {
    const vehiculoDb = this.vehiculoDb.create({
      id: vehiculo.id,
      clienteId: vehiculo.clienteId,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      kmActual: vehiculo.kmActual,
    });
    const resultado = await this.vehiculoDb.save(vehiculoDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<VehiculoEntity | null> {
    const vehiculo = await this.vehiculoDb.findOne({ where: { id } });
    return vehiculo ? this.mapearADominio(vehiculo) : null;
  }

  async obtenerPorClienteId(clienteId: string): Promise<VehiculoEntity[]> {
    const vehiculos = await this.vehiculoDb.find({ where: { clienteId } });
    return vehiculos.map((v) => this.mapearADominio(v));
  }

  async obtenerTodos(): Promise<VehiculoEntity[]> {
    const vehiculos = await this.vehiculoDb.find();
    return vehiculos.map((v) => this.mapearADominio(v));
  }

  async actualizar(vehiculo: VehiculoEntity): Promise<VehiculoEntity> {
    await this.vehiculoDb.update(
      { id: vehiculo.id },
      {
        placa: vehiculo.placa,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        kmActual: vehiculo.kmActual,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.vehiculoDb.findOneOrFail({
      where: { id: vehiculo.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.vehiculoDb.delete({ id });
  }

  private mapearADominio(vehiculoDb: VehiculoTypeormEntity): VehiculoEntity {
    return new VehiculoEntity({
      id: vehiculoDb.id,
      clienteId: vehiculoDb.clienteId,
      placa: vehiculoDb.placa,
      marca: vehiculoDb.marca,
      modelo: vehiculoDb.modelo,
      anio: vehiculoDb.anio,
      kmActual: vehiculoDb.kmActual,
      creadoEn: vehiculoDb.creadoEn,
      actualizadoEn: vehiculoDb.actualizadoEn,
    });
  }
}

