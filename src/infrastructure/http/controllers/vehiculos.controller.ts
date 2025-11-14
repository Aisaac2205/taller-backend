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
import { VehiculoEntity } from '@domain/entities/vehiculo.entity';
import { IVehiculoRepository } from '@application/ports/vehiculo.repository';
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto';
import { v4 as uuid } from 'uuid';

@Controller('vehiculos')
@UseGuards(JwtGuard, RolesGuard)
export class VehiculosController {
  constructor(
    @Inject('IVehiculoRepository')
    private vehiculoRepository: IVehiculoRepository
  ) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerTodos(): Promise<any[]> {
    const vehiculos = await this.vehiculoRepository.obtenerTodos();
    return vehiculos.map((v) => this.mapearRespuesta(v));
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerPorId(@Param('id') id: string): Promise<any> {
    const vehiculo = await this.vehiculoRepository.obtenerPorId(id);
    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }
    return this.mapearRespuesta(vehiculo);
  }

  @Post()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCION)
  async crear(@Body() createDto: CreateVehiculoDto): Promise<any> {
    const vehiculo = new VehiculoEntity({
      id: uuid(),
      clienteId: createDto.clienteId,
      placa: createDto.placa,
      marca: createDto.marca,
      modelo: createDto.modelo,
      anio: createDto.anio,
      kmActual: createDto.kmActual,
    });

    const vehiculoGuardado = await this.vehiculoRepository.crear(vehiculo);
    return this.mapearRespuesta(vehiculoGuardado);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.MECHANIC)
  async actualizar(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateVehiculoDto>
  ): Promise<any> {
    const vehiculo = await this.vehiculoRepository.obtenerPorId(id);
    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    if (updateDto.placa) vehiculo.placa = updateDto.placa;
    if (updateDto.marca) vehiculo.marca = updateDto.marca;
    if (updateDto.modelo) vehiculo.modelo = updateDto.modelo;
    if (updateDto.anio) vehiculo.anio = updateDto.anio;
    if (updateDto.kmActual) vehiculo.actualizarKm(updateDto.kmActual);

    const actualizado = await this.vehiculoRepository.actualizar(vehiculo);
    return this.mapearRespuesta(actualizado);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.vehiculoRepository.eliminar(id);
  }

  private mapearRespuesta(vehiculo: VehiculoEntity): any {
    return {
      id: vehiculo.id,
      clienteId: vehiculo.clienteId,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      kmActual: vehiculo.kmActual,
      creadoEn: vehiculo.creadoEn,
      actualizadoEn: vehiculo.actualizadoEn,
    };
  }
}

