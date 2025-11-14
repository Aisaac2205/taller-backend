import { Decimal } from '../value-objects/decimal.vo';

export enum EstadoVenta {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export interface DetalleVenta {
  productoId: string;
  cantidad: number;
  precioUnitario: Decimal;
}

export class VentaEntity {
  id: string;
  clienteId: string;
  usuarioId: string;
  detalles: DetalleVenta[];
  estado: EstadoVenta;
  costoTotal: Decimal;
  creadoEn: Date;
  actualizadoEn: Date;
  completadaEn?: Date;

  constructor(data: {
    id: string;
    clienteId: string;
    usuarioId: string;
    detalles: DetalleVenta[];
    estado?: EstadoVenta;
    costoTotal?: Decimal;
    creadoEn?: Date;
    actualizadoEn?: Date;
    completadaEn?: Date;
  }) {
    this.id = data.id;
    this.clienteId = data.clienteId;
    this.usuarioId = data.usuarioId;
    this.detalles = data.detalles;
    this.estado = data.estado ?? EstadoVenta.PENDIENTE;
    this.costoTotal = data.costoTotal ?? new Decimal(0);
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
    this.completadaEn = data.completadaEn;
  }

  public calcularCostoTotal(): Decimal {
    return this.detalles.reduce((total, detalle) => {
      const subtotal = detalle.precioUnitario.multiply(detalle.cantidad);
      return total.add(subtotal);
    }, new Decimal(0));
  }

  public completar(): void {
    if (this.estado !== EstadoVenta.PENDIENTE) {
      throw new Error('Solo se pueden completar ventas pendientes');
    }
    this.estado = EstadoVenta.COMPLETADA;
    this.completadaEn = new Date();
    this.actualizadoEn = new Date();
  }

  public estaCompletada(): boolean {
    return this.estado === EstadoVenta.COMPLETADA;
  }
}
