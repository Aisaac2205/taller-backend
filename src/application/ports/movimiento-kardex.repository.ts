import {
  MovimientoKardexEntity,
  TipoMovimiento,
} from '@domain/entities/movimiento-kardex.entity';

export interface IMovimientoKardexRepository {
  crear(movimiento: MovimientoKardexEntity): Promise<MovimientoKardexEntity>;
  obtenerPorId(id: string): Promise<MovimientoKardexEntity | null>;
  obtenerPorProducto(productoId: string): Promise<MovimientoKardexEntity[]>;
  obtenerPorTipo(tipo: TipoMovimiento): Promise<MovimientoKardexEntity[]>;
  obtenerTodos(): Promise<MovimientoKardexEntity[]>;
}
