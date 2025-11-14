import { VentaEntity, DetalleVenta } from '@domain/entities/venta.entity';
import {
  MovimientoKardexEntity,
  TipoMovimiento,
} from '@domain/entities/movimiento-kardex.entity';
import { IVentaRepository } from '@application/ports/venta.repository';
import { IProductoRepository } from '@application/ports/producto.repository';
import { IMovimientoKardexRepository } from '@application/ports/movimiento-kardex.repository';

export class RegistrarVentaUseCase {
  constructor(
    private readonly ventaRepository: IVentaRepository,
    private readonly productoRepository: IProductoRepository,
    private readonly movimientoKardexRepository: IMovimientoKardexRepository
  ) {}

  async ejecutar(input: {
    clienteId: string;
    usuarioId: string;
    detalles: Array<{
      productoId: string;
      cantidad: number;
    }>;
  }): Promise<VentaEntity> {
    // Validar y actualizar stock de productos
    const detallesVenta: DetalleVenta[] = [];
    for (const detalle of input.detalles) {
      const producto = await this.productoRepository.obtenerPorId(
        detalle.productoId
      );
      if (!producto) {
        throw new Error(`Producto ${detalle.productoId} no encontrado`);
      }

      if (!producto.tieneStock(detalle.cantidad)) {
        throw new Error(
          `Stock insuficiente para producto ${producto.marca} ${producto.presentacion}`
        );
      }

      // Descontar stock
      producto.descontarStock(detalle.cantidad);
      await this.productoRepository.actualizar(producto);

      // Registrar movimiento SALIDA
      const precioVenta = producto.obtenerPrecioVentaCalculado();
      const movimiento = new MovimientoKardexEntity({
        id: this.generarId(),
        productoId: detalle.productoId,
        tipo: TipoMovimiento.SALIDA,
        cantidad: detalle.cantidad,
        precioUnitario: precioVenta,
        razon: 'Venta directa',
        referenciaId: this.generarId(), // Será actualizado después
      });
      await this.movimientoKardexRepository.crear(movimiento);

      detallesVenta.push({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: precioVenta,
      });
    }

    // Crear venta
    const venta = new VentaEntity({
      id: this.generarId(),
      clienteId: input.clienteId,
      usuarioId: input.usuarioId,
      detalles: detallesVenta,
    });

    venta.costoTotal = venta.calcularCostoTotal();
    return await this.ventaRepository.crear(venta);
  }

  private generarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

