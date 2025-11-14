import { Email } from '../value-objects/email.vo';

export class ClienteEntity {
  id: string;
  nombre: string;
  email?: Email;
  telefono: string;
  direccion: string;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: {
    id: string;
    nombre: string;
    email?: Email;
    telefono: string;
    direccion: string;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.email = data.email;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
  }

  public actualizarContacto(telefono?: string, email?: Email): void {
    if (telefono) {
      this.telefono = telefono;
    }
    if (email) {
      this.email = email;
    }
    this.actualizadoEn = new Date();
  }
}
