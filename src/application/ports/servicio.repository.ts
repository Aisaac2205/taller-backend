import { ServicioEntity } from '@domain/entities/servicio.entity';

export interface IServicioRepository {
  crear(servicio: ServicioEntity): Promise<ServicioEntity>;
  obtenerPorId(id: string): Promise<ServicioEntity | null>;
  obtenerTodos(): Promise<ServicioEntity[]>;
  obtenerPorVehiculo(vehiculoId: string): Promise<ServicioEntity[]>;
  obtenerPorCliente(clienteId: string): Promise<ServicioEntity[]>;
  actualizar(servicio: ServicioEntity): Promise<ServicioEntity>;
  eliminar(id: string): Promise<void>;
}
