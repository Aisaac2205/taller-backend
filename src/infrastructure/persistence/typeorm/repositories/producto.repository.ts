import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity, TipoProducto } from '@domain/entities/producto.entity';
import { Decimal } from '@domain/value-objects/decimal.vo';
import { IProductoRepository } from '@application/ports/producto.repository';
import { ProductoTypeormEntity } from '../entities/producto.typeorm';

@Injectable()
export class ProductoRepository implements IProductoRepository {
  constructor(
    @InjectRepository(ProductoTypeormEntity)
    private readonly productoDb: Repository<ProductoTypeormEntity>
  ) {}

  async crear(producto: ProductoEntity): Promise<ProductoEntity> {
    const productoDb = this.productoDb.create({
      id: producto.id,
      tipo: producto.tipo,
      marca: producto.marca,
      presentacion: producto.presentacion,
      costoUnitario: producto.costoUnitario.getValue(),
      margenPorcentaje: producto.margenPorcentaje.getValue(),
      stockActual: producto.stockActual,
    });
    const resultado = await this.productoDb.save(productoDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<ProductoEntity | null> {
    const producto = await this.productoDb.findOne({ where: { id } });
    return producto ? this.mapearADominio(producto) : null;
  }

  async obtenerTodos(): Promise<ProductoEntity[]> {
    const productos = await this.productoDb.find();
    return productos.map((p) => this.mapearADominio(p));
  }

  async obtenerPorTipo(tipo: TipoProducto): Promise<ProductoEntity[]> {
    const productos = await this.productoDb.find({ where: { tipo } });
    return productos.map((p) => this.mapearADominio(p));
  }

  async actualizar(producto: ProductoEntity): Promise<ProductoEntity> {
    await this.productoDb.update(
      { id: producto.id },
      {
        marca: producto.marca,
        presentacion: producto.presentacion,
        costoUnitario: producto.costoUnitario.getValue(),
        margenPorcentaje: producto.margenPorcentaje.getValue(),
        stockActual: producto.stockActual,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.productoDb.findOneOrFail({
      where: { id: producto.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.productoDb.delete({ id });
  }

  private mapearADominio(productoDb: ProductoTypeormEntity): ProductoEntity {
    return new ProductoEntity({
      id: productoDb.id,
      tipo: productoDb.tipo as TipoProducto,
      marca: productoDb.marca,
      presentacion: productoDb.presentacion,
      costoUnitario: new Decimal(productoDb.costoUnitario),
      margenPorcentaje: new Decimal(productoDb.margenPorcentaje),
      stockActual: productoDb.stockActual,
      creadoEn: productoDb.creadoEn,
      actualizadoEn: productoDb.actualizadoEn,
    });
  }
}

