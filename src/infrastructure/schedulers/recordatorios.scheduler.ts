import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IRecordatorioRepository } from '@application/ports/recordatorio.repository';
import { IVehiculoRepository } from '@application/ports/vehiculo.repository';

@Injectable()
export class RecordatoriosScheduler {
  constructor(
    @Inject('IRecordatorioRepository')
    private recordatorioRepository: IRecordatorioRepository,
    @Inject('IVehiculoRepository')
    private vehiculoRepository: IVehiculoRepository
  ) {}

  @Cron('0 0 * * *') // Ejecutar diariamente a las 00:00
  async verificarRecordatorios(): Promise<void> {
    const recordatorios =
      await this.recordatorioRepository.obtenerPendientes();

    for (const recordatorio of recordatorios) {
      const vehiculo = await this.vehiculoRepository.obtenerPorId(
        recordatorio.vehiculoId
      );
      if (!vehiculo) continue;

      const hoy = new Date();
      const proximaFecha = new Date(recordatorio.fechaProxima);

      if (
        recordatorio.debeNotificar(vehiculo.kmActual) ||
        hoy >= proximaFecha
      ) {
        // Aquí se puede agregar lógica para enviar notificaciones
        // Por ahora solo registramos que se debe notificar
        console.log(
          `[SCHEDULER] Recordatorio pendiente para vehículo ${recordatorio.vehiculoId}: ${recordatorio.descripcion}`
        );
      }
    }
  }
}

