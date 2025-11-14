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
import { ProductoEntity, TipoProducto } from '@domain/entities/producto.entity';
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
  ) {}

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
      tipo: createDto.tipo as TipoProducto,
      marca: createDto.marca,
      presentacion: createDto.presentacion,
      costoUnitario: new Decimal(createDto.costoUnitario),
      margenPorcentaje: new Decimal(createDto.margenPorcentaje),
      stockActual: createDto.stockActual,
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

    if (updateDto.marca) producto.marca = updateDto.marca;
    if (updateDto.presentacion) producto.presentacion = updateDto.presentacion;
    if (updateDto.costoUnitario) {
      producto.costoUnitario = new Decimal(updateDto.costoUnitario);
    }
    if (updateDto.margenPorcentaje) {
      producto.margenPorcentaje = new Decimal(updateDto.margenPorcentaje);
    }
    if (updateDto.stockActual !== undefined) {
      producto.stockActual = updateDto.stockActual;
    }

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
      tipo: producto.tipo,
      marca: producto.marca,
      presentacion: producto.presentacion,
      costoUnitario: producto.costoUnitario.getValue(),
      margenPorcentaje: producto.margenPorcentaje.getValue(),
      precioVentaCalculado: producto.obtenerPrecioVentaCalculado().getValue(),
      stockActual: producto.stockActual,
      creadoEn: producto.creadoEn,
      actualizadoEn: producto.actualizadoEn,
    };
  }
}

