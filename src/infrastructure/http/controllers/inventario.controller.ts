import {
  Controller,
  Get,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtGuard } from '@infrastructure/auth/jwt.guard';
import { RolesGuard } from '@infrastructure/auth/roles.guard';
import { Roles } from '@infrastructure/auth/roles.decorator';
import { RolUsuario } from '@domain/entities/usuario.entity';
import { IMovimientoKardexRepository } from '@application/ports/movimiento-kardex.repository';
import { IProductoRepository } from '@application/ports/producto.repository';

@Controller('inventario')
@UseGuards(JwtGuard, RolesGuard)
export class InventarioController {
  constructor(
    @Inject('IMovimientoKardexRepository')
    private movimientoKardexRepository: IMovimientoKardexRepository,
    @Inject('IProductoRepository')
    private productoRepository: IProductoRepository
  ) {}

  @Get('kardex/:productoId')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER)
  async obtenerKardex(@Param('productoId') productoId: string): Promise<any[]> {
    const movimientos =
      await this.movimientoKardexRepository.obtenerPorProducto(productoId);
    return movimientos.map((m) => ({
      id: m.id,
      productoId: m.productoId,
      tipo: m.tipo,
      cantidad: m.cantidad,
      precioUnitario:
        typeof m.precioUnitario === 'object'
          ? m.precioUnitario.getValue()
          : m.precioUnitario,
      totalMovimiento:
        typeof m.totalMovimiento === 'object'
          ? m.totalMovimiento.getValue()
          : m.totalMovimiento,
      razon: m.razon,
      referenciaId: m.referenciaId,
      creadoEn: m.creadoEn,
    }));
  }

  @Get('productos/estado')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER)
  async obtenerEstadoProductos(): Promise<any[]> {
    const productos = await this.productoRepository.obtenerTodos();
    return productos.map((p) => ({
      id: p.id,
      tipo: p.tipo,
      marca: p.marca,
      presentacion: p.presentacion,
      costoUnitario: p.costoUnitario.getValue(),
      margenPorcentaje: p.margenPorcentaje.getValue(),
      precioVentaCalculado: p.obtenerPrecioVentaCalculado().getValue(),
      stockActual: p.stockActual,
      stockCritico: p.stockActual < 10,
    }));
  }
}

