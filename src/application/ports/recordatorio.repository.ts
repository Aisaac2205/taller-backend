import { RecordatorioEntity } from '@domain/entities/recordatorio.entity';

export interface IRecordatorioRepository {
  crear(recordatorio: RecordatorioEntity): Promise<RecordatorioEntity>;
  obtenerPorId(id: string): Promise<RecordatorioEntity | null>;
  obtenerTodos(): Promise<RecordatorioEntity[]>;
  obtenerPorVehiculo(vehiculoId: string): Promise<RecordatorioEntity[]>;
  obtenerPorCliente(clienteId: string): Promise<RecordatorioEntity[]>;
  obtenerPendientes(): Promise<RecordatorioEntity[]>;
  actualizar(recordatorio: RecordatorioEntity): Promise<RecordatorioEntity>;
  eliminar(id: string): Promise<void>;
}
