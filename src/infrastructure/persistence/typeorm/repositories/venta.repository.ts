import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaEntity, EstadoVenta, DetalleVenta } from '@domain/entities/venta.entity';
import { Decimal } from '@domain/value-objects/decimal.vo';
import { IVentaRepository } from '@application/ports/venta.repository';
import { VentaTypeormEntity } from '../entities/venta.typeorm';

@Injectable()
export class VentaRepository implements IVentaRepository {
  constructor(
    @InjectRepository(VentaTypeormEntity)
    private readonly ventaDb: Repository<VentaTypeormEntity>
  ) {}

  async crear(venta: VentaEntity): Promise<VentaEntity> {
    const ventaDb = this.ventaDb.create({
      id: venta.id,
      clienteId: venta.clienteId,
      usuarioId: venta.usuarioId,
      detalles: venta.detalles.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario.getValue(),
      })),
      estado: venta.estado,
      costoTotal: venta.costoTotal.getValue(),
    });
    const resultado = await this.ventaDb.save(ventaDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<VentaEntity | null> {
    const venta = await this.ventaDb.findOne({ where: { id } });
    return venta ? this.mapearADominio(venta) : null;
  }

  async obtenerTodos(): Promise<VentaEntity[]> {
    const ventas = await this.ventaDb.find();
    return ventas.map((v) => this.mapearADominio(v));
  }

  async obtenerPorCliente(clienteId: string): Promise<VentaEntity[]> {
    const ventas = await this.ventaDb.find({ where: { clienteId } });
    return ventas.map((v) => this.mapearADominio(v));
  }

  async actualizar(venta: VentaEntity): Promise<VentaEntity> {
    await this.ventaDb.update(
      { id: venta.id },
      {
        estado: venta.estado,
        costoTotal: venta.costoTotal.getValue(),
        completadaEn: venta.completadaEn,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.ventaDb.findOneOrFail({
      where: { id: venta.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.ventaDb.delete({ id });
  }

  private mapearADominio(ventaDb: VentaTypeormEntity): VentaEntity {
    const detalles: DetalleVenta[] = ventaDb.detalles.map((d) => ({
      productoId: d.productoId,
      cantidad: d.cantidad,
      precioUnitario: new Decimal(d.precioUnitario),
    }));

    return new VentaEntity({
      id: ventaDb.id,
      clienteId: ventaDb.clienteId,
      usuarioId: ventaDb.usuarioId,
      detalles,
      estado: ventaDb.estado as EstadoVenta,
      costoTotal: new Decimal(ventaDb.costoTotal),
      creadoEn: ventaDb.creadoEn,
      actualizadoEn: ventaDb.actualizadoEn,
      completadaEn: ventaDb.completadaEn || undefined,
    });
  }
}

