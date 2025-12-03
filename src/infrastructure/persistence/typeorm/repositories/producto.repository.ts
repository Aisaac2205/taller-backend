// En producto.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from '@domain/entities/producto.entity';
import { Decimal } from '@domain/value-objects/decimal.vo';
import { IProductoRepository } from '@application/ports/producto.repository';
import { ProductoTypeormEntity } from '../entities/producto.typeorm';

@Injectable()
export class ProductoRepository implements IProductoRepository {
  constructor(
    @InjectRepository(ProductoTypeormEntity)
    private readonly productoDb: Repository<ProductoTypeormEntity>
  ) { }

  async crear(producto: ProductoEntity): Promise<ProductoEntity> {
    const productoDb = this.productoDb.create({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      sku: producto.sku,
      precio: producto.precio.getValue(),
      categoria: producto.categoria,
      stock: producto.stock,
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

  async actualizar(producto: ProductoEntity): Promise<ProductoEntity> {
    await this.productoDb.update(
      { id: producto.id },
      {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        sku: producto.sku,
        precio: producto.precio.getValue(),
        categoria: producto.categoria,
        stock: producto.stock,
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
    // Solo manejamos el precio, el único campo Decimal restante que podría ser un problema.
    const precio = productoDb.precio ? new Decimal(productoDb.precio) : new Decimal(0);

    return new ProductoEntity({
      id: productoDb.id,
      nombre: productoDb.nombre,
      descripcion: productoDb.descripcion,
      sku: productoDb.sku,
      precio: precio,
      categoria: productoDb.categoria,
      stock: productoDb.stock,
      // Los campos eliminados (tipo, marca, costoUnitario, etc.)
      // ya no se mapean aquí.
      creadoEn: productoDb.creadoEn,
      actualizadoEn: productoDb.actualizadoEn,
    });
  }
}