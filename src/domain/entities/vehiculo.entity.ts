export class VehiculoEntity {
  id: string;
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  kmActual: number;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: {
    id: string;
    clienteId: string;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    kmActual: number;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = data.id;
    this.clienteId = data.clienteId;
    this.placa = data.placa;
    this.marca = data.marca;
    this.modelo = data.modelo;
    this.anio = data.anio;
    this.kmActual = data.kmActual;
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
  }

  public actualizarKm(nuevoKm: number): void {
    if (nuevoKm < this.kmActual) {
      throw new Error('El kilometraje no puede disminuir');
    }
    this.kmActual = nuevoKm;
    this.actualizadoEn = new Date();
  }
}
