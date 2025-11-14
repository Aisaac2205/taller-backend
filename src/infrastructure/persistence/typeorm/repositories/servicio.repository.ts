import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ServicioEntity,
  EstadoServicio,
  DetalleServicio,
} from '@domain/entities/servicio.entity';
import { Decimal } from '@domain/value-objects/decimal.vo';
import { IServicioRepository } from '@application/ports/servicio.repository';
import { ServicioTypeormEntity } from '../entities/servicio.typeorm';

@Injectable()
export class ServicioRepository implements IServicioRepository {
  constructor(
    @InjectRepository(ServicioTypeormEntity)
    private readonly servicioDb: Repository<ServicioTypeormEntity>
  ) {}

  async crear(servicio: ServicioEntity): Promise<ServicioEntity> {
    const servicioDb = this.servicioDb.create({
      id: servicio.id,
      vehiculoId: servicio.vehiculoId,
      clienteId: servicio.clienteId,
      mecanicoId: servicio.mecanicoId,
      kmRegistrado: servicio.kmRegistrado,
      descripcion: servicio.descripcion,
      detalles: servicio.detalles.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario.getValue(),
      })),
      estado: servicio.estado,
      costoTotal: servicio.costoTotal.getValue(),
    });
    const resultado = await this.servicioDb.save(servicioDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<ServicioEntity | null> {
    const servicio = await this.servicioDb.findOne({ where: { id } });
    return servicio ? this.mapearADominio(servicio) : null;
  }

  async obtenerTodos(): Promise<ServicioEntity[]> {
    const servicios = await this.servicioDb.find();
    return servicios.map((s) => this.mapearADominio(s));
  }

  async obtenerPorVehiculo(vehiculoId: string): Promise<ServicioEntity[]> {
    const servicios = await this.servicioDb.find({ where: { vehiculoId } });
    return servicios.map((s) => this.mapearADominio(s));
  }

  async obtenerPorCliente(clienteId: string): Promise<ServicioEntity[]> {
    const servicios = await this.servicioDb.find({ where: { clienteId } });
    return servicios.map((s) => this.mapearADominio(s));
  }

  async actualizar(servicio: ServicioEntity): Promise<ServicioEntity> {
    await this.servicioDb.update(
      { id: servicio.id },
      {
        estado: servicio.estado,
        costoTotal: servicio.costoTotal.getValue(),
        completadoEn: servicio.completadoEn,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.servicioDb.findOneOrFail({
      where: { id: servicio.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.servicioDb.delete({ id });
  }

  private mapearADominio(servicioDb: ServicioTypeormEntity): ServicioEntity {
    const detalles: DetalleServicio[] = servicioDb.detalles.map((d) => ({
      productoId: d.productoId,
      cantidad: d.cantidad,
      precioUnitario: new Decimal(d.precioUnitario),
    }));

    return new ServicioEntity({
      id: servicioDb.id,
      vehiculoId: servicioDb.vehiculoId,
      clienteId: servicioDb.clienteId,
      mecanicoId: servicioDb.mecanicoId,
      kmRegistrado: servicioDb.kmRegistrado,
      descripcion: servicioDb.descripcion,
      detalles,
      estado: servicioDb.estado as EstadoServicio,
      costoTotal: new Decimal(servicioDb.costoTotal),
      creadoEn: servicioDb.creadoEn,
      actualizadoEn: servicioDb.actualizadoEn,
      completadoEn: servicioDb.completadoEn || undefined,
    });
  }
}

