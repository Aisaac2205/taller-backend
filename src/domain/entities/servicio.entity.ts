import { Decimal } from '../value-objects/decimal.vo';

export enum EstadoServicio {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export interface DetalleServicio {
  productoId: string;
  cantidad: number;
  precioUnitario: Decimal;
}

export class ServicioEntity {
  id: string;
  vehiculoId: string;
  clienteId: string;
  mecanicoId: string;
  kmRegistrado: number;
  descripcion: string;
  detalles: DetalleServicio[];
  estado: EstadoServicio;
  costoTotal: Decimal;
  creadoEn: Date;
  actualizadoEn: Date;
  completadoEn?: Date;

  constructor(data: {
    id: string;
    vehiculoId: string;
    clienteId: string;
    mecanicoId: string;
    kmRegistrado: number;
    descripcion: string;
    detalles: DetalleServicio[];
    estado?: EstadoServicio;
    costoTotal?: Decimal;
    creadoEn?: Date;
    actualizadoEn?: Date;
    completadoEn?: Date;
  }) {
    this.id = data.id;
    this.vehiculoId = data.vehiculoId;
    this.clienteId = data.clienteId;
    this.mecanicoId = data.mecanicoId;
    this.kmRegistrado = data.kmRegistrado;
    this.descripcion = data.descripcion;
    this.detalles = data.detalles;
    this.estado = data.estado ?? EstadoServicio.PENDIENTE;
    this.costoTotal = data.costoTotal ?? new Decimal(0);
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
    this.completadoEn = data.completadoEn;
  }

  public calcularCostoTotal(): Decimal {
    return this.detalles.reduce((total, detalle) => {
      const subtotal = detalle.precioUnitario.multiply(detalle.cantidad);
      return total.add(subtotal);
    }, new Decimal(0));
  }

  public completar(): void {
    if (this.estado !== EstadoServicio.EN_PROCESO) {
      throw new Error('Solo se pueden completar servicios en proceso');
    }
    this.estado = EstadoServicio.COMPLETADO;
    this.completadoEn = new Date();
    this.actualizadoEn = new Date();
  }

  public estaCompletado(): boolean {
    return this.estado === EstadoServicio.COMPLETADO;
  }
}
