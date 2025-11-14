import { ProductoEntity, TipoProducto } from '@domain/entities/producto.entity';

export interface IProductoRepository {
  crear(producto: ProductoEntity): Promise<ProductoEntity>;
  obtenerPorId(id: string): Promise<ProductoEntity | null>;
  obtenerTodos(): Promise<ProductoEntity[]>;
  obtenerPorTipo(tipo: TipoProducto): Promise<ProductoEntity[]>;
  actualizar(producto: ProductoEntity): Promise<ProductoEntity>;
  eliminar(id: string): Promise<void>;
}
