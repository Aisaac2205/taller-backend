import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtGuard } from '@infrastructure/auth/jwt.guard';
import { RolesGuard } from '@infrastructure/auth/roles.guard';
import { Roles } from '@infrastructure/auth/roles.decorator';
import { RolUsuario } from '@domain/entities/usuario.entity';
import { ClienteEntity } from '@domain/entities/cliente.entity';
import { Email } from '@domain/value-objects/email.vo';
import { IClienteRepository } from '@application/ports/cliente.repository';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { v4 as uuid } from 'uuid';

@Controller('clientes')
@UseGuards(JwtGuard, RolesGuard)
export class ClientesController {
  constructor(
    @Inject('IClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerTodos(): Promise<any[]> {
    const clientes = await this.clienteRepository.obtenerTodos();
    return clientes.map((c) => this.mapearRespuesta(c));
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerPorId(@Param('id') id: string): Promise<any> {
    const cliente = await this.clienteRepository.obtenerPorId(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return this.mapearRespuesta(cliente);
  }

  @Post()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCION)
  async crear(@Body() createDto: CreateClienteDto): Promise<any> {
    const cliente = new ClienteEntity({
      id: uuid(),
      nombre: createDto.nombre,
      email: createDto.email ? new Email(createDto.email) : undefined,
      telefono: createDto.telefono,
      direccion: createDto.direccion,
    });

    const clienteGuardado = await this.clienteRepository.crear(cliente);
    return this.mapearRespuesta(clienteGuardado);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCION)
  async actualizar(
    @Param('id') id: string,
    @Body() updateDto: CreateClienteDto
  ): Promise<any> {
    const cliente = await this.clienteRepository.obtenerPorId(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    cliente.nombre = updateDto.nombre;
    cliente.telefono = updateDto.telefono;
    cliente.direccion = updateDto.direccion;
    if (updateDto.email) {
      cliente.email = new Email(updateDto.email);
    }

    const actualizado = await this.clienteRepository.actualizar(cliente);
    return this.mapearRespuesta(actualizado);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.clienteRepository.eliminar(id);
  }

  private mapearRespuesta(cliente: ClienteEntity): any {
    return {
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email?.getValue(),
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      creadoEn: cliente.creadoEn,
      actualizadoEn: cliente.actualizadoEn,
    };
  }
}

