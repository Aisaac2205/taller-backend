import { Decimal } from '../value-objects/decimal.vo';

export enum TipoProducto {
  ACEITE = 'ACEITE',
  FILTRO = 'FILTRO',
  OTRO = 'OTRO',
}

export class ProductoEntity {
  id: string;
  nombre: string;
  descripcion: string;
  sku: string;
  precio: Decimal;
  categoria: string;
  stock: number;

  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: {
    id: string;
    nombre?: string;
    descripcion?: string;
    sku?: string;
    precio?: Decimal | number;
    categoria?: string;
    stock?: number;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = data.id;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.sku = data.sku || '';
    this.precio = data.precio instanceof Decimal ? data.precio : new Decimal(data.precio || 0);
    this.categoria = data.categoria || '';
    this.stock = data.stock || 0;

    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
  }

  public obtenerPrecioVentaCalculado(): Decimal {
    return this.precio;
  }

  public tieneStock(cantidad: number): boolean {
    return this.stock >= cantidad;
  }

  public descontarStock(cantidad: number): void {
    if (!this.tieneStock(cantidad)) {
      throw new Error(
        `Stock insuficiente. Disponible: ${this.stock}, Solicitado: ${cantidad}`
      );
    }
    this.stock -= cantidad;
  }

  public agregarStock(cantidad: number): void {
    this.stock += cantidad;
  }
}
