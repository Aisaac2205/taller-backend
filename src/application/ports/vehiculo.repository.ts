import { VehiculoEntity } from '@domain/entities/vehiculo.entity';

export interface IVehiculoRepository {
  crear(vehiculo: VehiculoEntity): Promise<VehiculoEntity>;
  obtenerPorId(id: string): Promise<VehiculoEntity | null>;
  obtenerPorClienteId(clienteId: string): Promise<VehiculoEntity[]>;
  obtenerTodos(): Promise<VehiculoEntity[]>;
  actualizar(vehiculo: VehiculoEntity): Promise<VehiculoEntity>;
  eliminar(id: string): Promise<void>;
}
