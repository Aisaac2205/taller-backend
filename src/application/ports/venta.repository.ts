import { VentaEntity } from '@domain/entities/venta.entity';

export interface IVentaRepository {
  crear(venta: VentaEntity): Promise<VentaEntity>;
  obtenerPorId(id: string): Promise<VentaEntity | null>;
  obtenerTodos(): Promise<VentaEntity[]>;
  obtenerPorCliente(clienteId: string): Promise<VentaEntity[]>;
  actualizar(venta: VentaEntity): Promise<VentaEntity>;
  eliminar(id: string): Promise<void>;
}
