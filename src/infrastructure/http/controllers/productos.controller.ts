import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtGuard } from '@infrastructure/auth/jwt.guard';
import { RolesGuard } from '@infrastructure/auth/roles.guard';
import { Roles } from '@infrastructure/auth/roles.decorator';
import { RolUsuario } from '@domain/entities/usuario.entity';
import { ProductoEntity } from '@domain/entities/producto.entity';
import { Decimal } from '@domain/value-objects/decimal.vo';
import { IProductoRepository } from '@application/ports/producto.repository';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { v4 as uuid } from 'uuid';

@Controller('productos')
@UseGuards(JwtGuard, RolesGuard)
export class ProductosController {
  constructor(
    @Inject('IProductoRepository')
    private productoRepository: IProductoRepository
  ) { }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerTodos(): Promise<any[]> {
    const productos = await this.productoRepository.obtenerTodos();
    return productos.map((p) => this.mapearRespuesta(p));
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerPorId(@Param('id') id: string): Promise<any> {
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return this.mapearRespuesta(producto);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  async crear(@Body() createDto: CreateProductoDto): Promise<any> {
    const producto = new ProductoEntity({
      id: uuid(),
      nombre: createDto.nombre,
      descripcion: createDto.descripcion,
      sku: createDto.sku,
      precio: createDto.precio,
      categoria: createDto.categoria,
      stock: createDto.stock,
    });

    const productoGuardado = await this.productoRepository.crear(producto);
    return this.mapearRespuesta(productoGuardado);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  async actualizar(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateProductoDto>
  ): Promise<any> {
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (updateDto.nombre) producto.nombre = updateDto.nombre;
    if (updateDto.descripcion) producto.descripcion = updateDto.descripcion;
    if (updateDto.sku) producto.sku = updateDto.sku;
    if (updateDto.precio) producto.precio = new Decimal(updateDto.precio);
    if (updateDto.categoria) producto.categoria = updateDto.categoria;
    if (updateDto.stock !== undefined) producto.stock = updateDto.stock;

    const actualizado = await this.productoRepository.actualizar(producto);
    return this.mapearRespuesta(actualizado);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.productoRepository.eliminar(id);
  }

  private mapearRespuesta(producto: ProductoEntity): any {
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      sku: producto.sku,
      precio: producto.precio.getValue(),
      categoria: producto.categoria,
      stock: producto.stock,
      precioVentaCalculado: producto.obtenerPrecioVentaCalculado().getValue(),
      creadoEn: producto.creadoEn,
      actualizadoEn: producto.actualizadoEn,
    };
  }
}

