export class CalculoProximoCambioService {
  private static readonly KM_INTERVALO = 5000;
  private static readonly MESES_INTERVALO = 3;

  public calcularProximoKm(kmActual: number): number {
    return kmActual + CalculoProximoCambioService.KM_INTERVALO;
  }

  public calcularProximaFecha(fechaActual: Date): Date {
    const proxima = new Date(fechaActual);
    proxima.setMonth(
      proxima.getMonth() + CalculoProximoCambioService.MESES_INTERVALO
    );
    return proxima;
  }

  public determinarProxima(
    kmActual: number,
    fechaActual: Date
  ): {
    tipo: 'KM' | 'FECHA';
    valor: number | Date;
  } {
    const proximoKm = this.calcularProximoKm(kmActual);
    const proximaFecha = this.calcularProximaFecha(fechaActual);

    // Comparar cuál ocurre primero
    const kmAhora = new Date();
    kmAhora.setFullYear(kmAhora.getFullYear() + 1); // Aproximación: ~5000 km en 1 año

    if (proximaFecha < kmAhora) {
      return {
        tipo: 'FECHA',
        valor: proximaFecha,
      };
    }

    return {
      tipo: 'KM',
      valor: proximoKm,
    };
  }
}
