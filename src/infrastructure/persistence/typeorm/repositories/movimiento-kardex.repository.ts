import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MovimientoKardexEntity,
  TipoMovimiento,
} from '@domain/entities/movimiento-kardex.entity';
import { Decimal } from '@domain/value-objects/decimal.vo';
import { IMovimientoKardexRepository } from '@application/ports/movimiento-kardex.repository';
import { MovimientoKardexTypeormEntity } from '../entities/movimiento-kardex.typeorm';

@Injectable()
export class MovimientoKardexRepository implements IMovimientoKardexRepository {
  constructor(
    @InjectRepository(MovimientoKardexTypeormEntity)
    private readonly movimientoDb: Repository<MovimientoKardexTypeormEntity>
  ) {}

  async crear(
    movimiento: MovimientoKardexEntity
  ): Promise<MovimientoKardexEntity> {
    const movimientoDb = this.movimientoDb.create({
      id: movimiento.id,
      productoId: movimiento.productoId,
      tipo: movimiento.tipo,
      cantidad: movimiento.cantidad,
      precioUnitario: movimiento.precioUnitario.getValue(),
      totalMovimiento: movimiento.totalMovimiento.getValue(),
      razon: movimiento.razon,
      referenciaId: movimiento.referenciaId,
    });
    const resultado = await this.movimientoDb.save(movimientoDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<MovimientoKardexEntity | null> {
    const movimiento = await this.movimientoDb.findOne({ where: { id } });
    return movimiento ? this.mapearADominio(movimiento) : null;
  }

  async obtenerPorProducto(
    productoId: string
  ): Promise<MovimientoKardexEntity[]> {
    const movimientos = await this.movimientoDb.find({ where: { productoId } });
    return movimientos.map((m) => this.mapearADominio(m));
  }

  async obtenerPorTipo(tipo: TipoMovimiento): Promise<MovimientoKardexEntity[]> {
    const movimientos = await this.movimientoDb.find({ where: { tipo } });
    return movimientos.map((m) => this.mapearADominio(m));
  }

  async obtenerTodos(): Promise<MovimientoKardexEntity[]> {
    const movimientos = await this.movimientoDb.find();
    return movimientos.map((m) => this.mapearADominio(m));
  }

  private mapearADominio(
    movimientoDb: MovimientoKardexTypeormEntity
  ): MovimientoKardexEntity {
    return new MovimientoKardexEntity({
      id: movimientoDb.id,
      productoId: movimientoDb.productoId,
      tipo: movimientoDb.tipo as TipoMovimiento,
      cantidad: movimientoDb.cantidad,
      precioUnitario: new Decimal(movimientoDb.precioUnitario),
      razon: movimientoDb.razon,
      referenciaId: movimientoDb.referenciaId,
      creadoEn: movimientoDb.creadoEn,
    });
  }
}

