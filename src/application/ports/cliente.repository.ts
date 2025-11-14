import { ClienteEntity } from '@domain/entities/cliente.entity';

export interface IClienteRepository {
  crear(cliente: ClienteEntity): Promise<ClienteEntity>;
  obtenerPorId(id: string): Promise<ClienteEntity | null>;
  obtenerTodos(): Promise<ClienteEntity[]>;
  actualizar(cliente: ClienteEntity): Promise<ClienteEntity>;
  eliminar(id: string): Promise<void>;
}
