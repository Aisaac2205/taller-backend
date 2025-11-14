import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtGuard } from '@infrastructure/auth/jwt.guard';
import { RolesGuard } from '@infrastructure/auth/roles.guard';
import { Roles } from '@infrastructure/auth/roles.decorator';
import { RolUsuario } from '@domain/entities/usuario.entity';
import { IRecordatorioRepository } from '@application/ports/recordatorio.repository';

@Controller('recordatorios')
@UseGuards(JwtGuard, RolesGuard)
export class RecordatoriosController {
  constructor(
    @Inject('IRecordatorioRepository')
    private recordatorioRepository: IRecordatorioRepository
  ) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerTodos(): Promise<any[]> {
    const recordatorios = await this.recordatorioRepository.obtenerTodos();
    return recordatorios.map((r) => this.mapearRespuesta(r));
  }

  @Get('pendientes')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerPendientes(): Promise<any[]> {
    const recordatorios =
      await this.recordatorioRepository.obtenerPendientes();
    return recordatorios.map((r) => this.mapearRespuesta(r));
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC, RolUsuario.RECEPCION)
  async obtenerPorId(@Param('id') id: string): Promise<any> {
    const recordatorio = await this.recordatorioRepository.obtenerPorId(id);
    if (!recordatorio) {
      throw new Error('Recordatorio no encontrado');
    }
    return this.mapearRespuesta(recordatorio);
  }

  @Patch(':id/completar')
  @Roles(RolUsuario.ADMIN, RolUsuario.MECHANIC)
  async completar(@Param('id') id: string): Promise<any> {
    const recordatorio = await this.recordatorioRepository.obtenerPorId(id);
    if (!recordatorio) {
      throw new Error('Recordatorio no encontrado');
    }

    recordatorio.completar();
    const actualizado = await this.recordatorioRepository.actualizar(
      recordatorio
    );
    return this.mapearRespuesta(actualizado);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.recordatorioRepository.eliminar(id);
  }

  private mapearRespuesta(recordatorio: any): any {
    return {
      id: recordatorio.id,
      vehiculoId: recordatorio.vehiculoId,
      clienteId: recordatorio.clienteId,
      tipoRecordatorio: recordatorio.tipoRecordatorio,
      kmProximo: recordatorio.kmProximo,
      fechaProxima: recordatorio.fechaProxima,
      descripcion: recordatorio.descripcion,
      estado: recordatorio.estado,
      creadoEn: recordatorio.creadoEn,
      actualizadoEn: recordatorio.actualizadoEn,
    };
  }
}

