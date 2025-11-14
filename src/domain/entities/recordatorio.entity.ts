export enum EstadoRecordatorio {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export class RecordatorioEntity {
  id: string;
  vehiculoId: string;
  clienteId: string;
  tipoRecordatorio: 'CAMBIO_ACEITE' | 'MANTENIMIENTO';
  kmProximo: number;
  fechaProxima: Date;
  descripcion: string;
  estado: EstadoRecordatorio;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: {
    id: string;
    vehiculoId: string;
    clienteId: string;
    tipoRecordatorio: 'CAMBIO_ACEITE' | 'MANTENIMIENTO';
    kmProximo: number;
    fechaProxima: Date;
    descripcion: string;
    estado?: EstadoRecordatorio;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = data.id;
    this.vehiculoId = data.vehiculoId;
    this.clienteId = data.clienteId;
    this.tipoRecordatorio = data.tipoRecordatorio;
    this.kmProximo = data.kmProximo;
    this.fechaProxima = data.fechaProxima;
    this.descripcion = data.descripcion;
    this.estado = data.estado ?? EstadoRecordatorio.PENDIENTE;
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
  }

  public debeNotificar(kmActual: number): boolean {
    return kmActual >= this.kmProximo && this.estado === EstadoRecordatorio.PENDIENTE;
  }

  public completar(): void {
    this.estado = EstadoRecordatorio.COMPLETADO;
    this.actualizadoEn = new Date();
  }
}
