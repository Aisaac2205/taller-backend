import { ServicioEntity, DetalleServicio } from '@domain/entities/servicio.entity';
import { RecordatorioEntity } from '@domain/entities/recordatorio.entity';
import {
  MovimientoKardexEntity,
  TipoMovimiento,
} from '@domain/entities/movimiento-kardex.entity';
import { CalculoProximoCambioService } from '@domain/services/calculo-proximo-cambio.service';
import { IServicioRepository } from '@application/ports/servicio.repository';
import { IProductoRepository } from '@application/ports/producto.repository';
import { IVehiculoRepository } from '@application/ports/vehiculo.repository';
import { IRecordatorioRepository } from '@application/ports/recordatorio.repository';
import { IMovimientoKardexRepository } from '@application/ports/movimiento-kardex.repository';

export class RegistrarServicioUseCase {
  constructor(
    private readonly servicioRepository: IServicioRepository,
    private readonly productoRepository: IProductoRepository,
    private readonly vehiculoRepository: IVehiculoRepository,
    private readonly recordatorioRepository: IRecordatorioRepository,
    private readonly movimientoKardexRepository: IMovimientoKardexRepository,
    private readonly calculoService: CalculoProximoCambioService
  ) {}

  async ejecutar(input: {
    vehiculoId: string;
    clienteId: string;
    mecanicoId: string;
    kmRegistrado: number;
    descripcion: string;
    detalles: Array<{
      productoId: string;
      cantidad: number;
    }>;
  }): Promise<ServicioEntity> {
    // Validar vehículo existe
    const vehiculo = await this.vehiculoRepository.obtenerPorId(
      input.vehiculoId
    );
    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    // Validar y actualizar stock de productos
    const detallesServicio: DetalleServicio[] = [];
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
        razon: `Servicio realizado - ${input.descripcion}`,
        referenciaId: this.generarId(), // Será actualizado después
      });
      await this.movimientoKardexRepository.crear(movimiento);

      detallesServicio.push({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: precioVenta,
      });
    }

    // Crear servicio
    const servicioId = this.generarId();
    const servicio = new ServicioEntity({
      id: servicioId,
      vehiculoId: input.vehiculoId,
      clienteId: input.clienteId,
      mecanicoId: input.mecanicoId,
      kmRegistrado: input.kmRegistrado,
      descripcion: input.descripcion,
      detalles: detallesServicio,
    });

    servicio.costoTotal = servicio.calcularCostoTotal();
    const servicioGuardado = await this.servicioRepository.crear(servicio);

    // Actualizar km del vehículo
    vehiculo.actualizarKm(input.kmRegistrado);
    await this.vehiculoRepository.actualizar(vehiculo);

    // Crear recordatorio con la próxima fecha/km
    const proximoKm = this.calculoService.calcularProximoKm(input.kmRegistrado);
    const proximaFecha = this.calculoService.calcularProximaFecha(new Date());
    const proxima = this.calculoService.determinarProxima(
      input.kmRegistrado,
      new Date()
    );

    const recordatorio = new RecordatorioEntity({
      id: this.generarId(),
      vehiculoId: input.vehiculoId,
      clienteId: input.clienteId,
      tipoRecordatorio: 'CAMBIO_ACEITE',
      kmProximo: proximoKm,
      fechaProxima: proximaFecha,
      descripcion: `Próximo cambio de aceite. Ocurre por: ${proxima.tipo}`,
    });

    await this.recordatorioRepository.crear(recordatorio);

    return servicioGuardado;
  }

  private generarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
