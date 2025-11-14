import { Decimal } from '../value-objects/decimal.vo';

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

export class MovimientoKardexEntity {
  id: string;
  productoId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  precioUnitario: Decimal;
  totalMovimiento: Decimal;
  razon: string;
  referenciaId?: string; // servicioId o ventaId
  creadoEn: Date;

  constructor(data: {
    id: string;
    productoId: string;
    tipo: TipoMovimiento;
    cantidad: number;
    precioUnitario: Decimal;
    razon: string;
    referenciaId?: string;
    creadoEn?: Date;
  }) {
    this.id = data.id;
    this.productoId = data.productoId;
    this.tipo = data.tipo;
    this.cantidad = data.cantidad;
    this.precioUnitario = data.precioUnitario;
    this.totalMovimiento = data.precioUnitario.multiply(data.cantidad);
    this.razon = data.razon;
    this.referenciaId = data.referenciaId;
    this.creadoEn = data.creadoEn ?? new Date();
  }

  public esSalida(): boolean {
    return this.tipo === TipoMovimiento.SALIDA;
  }

  public esEntrada(): boolean {
    return this.tipo === TipoMovimiento.ENTRADA;
  }
}
