import { Decimal } from '../value-objects/decimal.vo';

export enum TipoProducto {
  ACEITE = 'ACEITE',
  FILTRO = 'FILTRO',
  OTRO = 'OTRO',
}

export class ProductoEntity {
  id: string;
  tipo: TipoProducto;
  marca: string;
  presentacion: string;
  costoUnitario: Decimal;
  margenPorcentaje: Decimal;
  stockActual: number;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: {
    id: string;
    tipo: TipoProducto;
    marca: string;
    presentacion: string;
    costoUnitario: Decimal;
    margenPorcentaje: Decimal;
    stockActual: number;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = data.id;
    this.tipo = data.tipo;
    this.marca = data.marca;
    this.presentacion = data.presentacion;
    this.costoUnitario = data.costoUnitario;
    this.margenPorcentaje = data.margenPorcentaje;
    this.stockActual = data.stockActual;
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
  }

  public obtenerPrecioVentaCalculado(): Decimal {
    const factor = new Decimal(
      1 + this.margenPorcentaje.getValue() / 100
    );
    return this.costoUnitario.multiply(factor.getValue());
  }

  public tieneStock(cantidad: number): boolean {
    return this.stockActual >= cantidad;
  }

  public descontarStock(cantidad: number): void {
    if (!this.tieneStock(cantidad)) {
      throw new Error(
        `Stock insuficiente. Disponible: ${this.stockActual}, Solicitado: ${cantidad}`
      );
    }
    this.stockActual -= cantidad;
  }

  public agregarStock(cantidad: number): void {
    this.stockActual += cantidad;
  }
}
