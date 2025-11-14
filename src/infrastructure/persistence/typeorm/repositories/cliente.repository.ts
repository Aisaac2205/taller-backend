import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from '@domain/entities/cliente.entity';
import { Email } from '@domain/value-objects/email.vo';
import { IClienteRepository } from '@application/ports/cliente.repository';
import { ClienteTypeormEntity } from '../entities/cliente.typeorm';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteTypeormEntity)
    private readonly clienteDb: Repository<ClienteTypeormEntity>
  ) {}

  async crear(cliente: ClienteEntity): Promise<ClienteEntity> {
    const clienteDb = this.clienteDb.create({
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email?.getValue(),
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    const resultado = await this.clienteDb.save(clienteDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<ClienteEntity | null> {
    const cliente = await this.clienteDb.findOne({ where: { id } });
    return cliente ? this.mapearADominio(cliente) : null;
  }

  async obtenerTodos(): Promise<ClienteEntity[]> {
    const clientes = await this.clienteDb.find();
    return clientes.map((c) => this.mapearADominio(c));
  }

  async actualizar(cliente: ClienteEntity): Promise<ClienteEntity> {
    await this.clienteDb.update(
      { id: cliente.id },
      {
        nombre: cliente.nombre,
        email: cliente.email?.getValue(),
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.clienteDb.findOneOrFail({
      where: { id: cliente.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.clienteDb.delete({ id });
  }

  private mapearADominio(clienteDb: ClienteTypeormEntity): ClienteEntity {
    return new ClienteEntity({
      id: clienteDb.id,
      nombre: clienteDb.nombre,
      email: clienteDb.email ? new Email(clienteDb.email) : undefined,
      telefono: clienteDb.telefono,
      direccion: clienteDb.direccion,
      creadoEn: clienteDb.creadoEn,
      actualizadoEn: clienteDb.actualizadoEn,
    });
  }
}

