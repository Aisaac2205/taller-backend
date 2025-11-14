import { Email } from '../value-objects/email.vo';

export enum RolUsuario {
  ADMIN = 'admin',
  OWNER = 'owner',
  MECHANIC = 'mechanic',
  RECEPCION = 'recepcion',
}

export class UsuarioEntity {
  id: string;
  email: Email;
  passwordHash: string;
  nombre: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: {
    id: string;
    email: Email;
    passwordHash: string;
    nombre: string;
    rol: RolUsuario;
    activo?: boolean;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.nombre = data.nombre;
    this.rol = data.rol;
    this.activo = data.activo ?? true;
    this.creadoEn = data.creadoEn ?? new Date();
    this.actualizadoEn = data.actualizadoEn ?? new Date();
  }

  public hasRol(rol: RolUsuario): boolean {
    return this.rol === rol;
  }

  public puedeEliminar(): boolean {
    return this.rol === RolUsuario.ADMIN;
  }

  public puedeVerReportes(): boolean {
    return this.rol === RolUsuario.ADMIN || this.rol === RolUsuario.OWNER;
  }

  public puedeRegistrarServicio(): boolean {
    return this.rol === RolUsuario.MECHANIC || this.rol === RolUsuario.ADMIN;
  }

  public puedeRegistrarVenta(): boolean {
    return (
      this.rol === RolUsuario.RECEPCION ||
      this.rol === RolUsuario.ADMIN
    );
  }
}
