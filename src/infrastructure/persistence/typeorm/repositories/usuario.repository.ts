import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity, RolUsuario } from '@domain/entities/usuario.entity';
import { Email } from '@domain/value-objects/email.vo';
import { IUsuarioRepository } from '@application/ports/usuario.repository';
import { UsuarioTypeormEntity } from '../entities/usuario.typeorm';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(
    @InjectRepository(UsuarioTypeormEntity)
    private readonly usuarioDb: Repository<UsuarioTypeormEntity>
  ) {}

  async crear(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    const usuarioDb = this.usuarioDb.create({
      id: usuario.id,
      email: usuario.email.getValue(),
      passwordHash: usuario.passwordHash,
      nombre: usuario.nombre,
      rol: usuario.rol,
      activo: usuario.activo,
    });
    const resultado = await this.usuarioDb.save(usuarioDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<UsuarioEntity | null> {
    const usuario = await this.usuarioDb.findOne({ where: { id } });
    return usuario ? this.mapearADominio(usuario) : null;
  }

  async obtenerPorEmail(email: string): Promise<UsuarioEntity | null> {
    const usuario = await this.usuarioDb.findOne({
      where: { email: email.toLowerCase() },
    });
    return usuario ? this.mapearADominio(usuario) : null;
  }

  async obtenerTodos(): Promise<UsuarioEntity[]> {
    const usuarios = await this.usuarioDb.find();
    return usuarios.map((u) => this.mapearADominio(u));
  }

  async obtenerPorRol(rol: RolUsuario): Promise<UsuarioEntity[]> {
    const usuarios = await this.usuarioDb.find({ where: { rol } });
    return usuarios.map((u) => this.mapearADominio(u));
  }

  async actualizar(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    await this.usuarioDb.update(
      { id: usuario.id },
      {
        email: usuario.email.getValue(),
        nombre: usuario.nombre,
        rol: usuario.rol,
        activo: usuario.activo,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.usuarioDb.findOneOrFail({
      where: { id: usuario.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.usuarioDb.delete({ id });
  }

  private mapearADominio(usuarioDb: UsuarioTypeormEntity): UsuarioEntity {
    return new UsuarioEntity({
      id: usuarioDb.id,
      email: new Email(usuarioDb.email),
      passwordHash: usuarioDb.passwordHash,
      nombre: usuarioDb.nombre,
      rol: usuarioDb.rol as RolUsuario,
      activo: usuarioDb.activo,
      creadoEn: usuarioDb.creadoEn,
      actualizadoEn: usuarioDb.actualizadoEn,
    });
  }
}

