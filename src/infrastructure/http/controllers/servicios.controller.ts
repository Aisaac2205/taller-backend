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
  Request,
} from '@nestjs/common';
import { JwtGuard } from '@infrastructure/auth/jwt.guard';
import { RolesGuard } from '@infrastructure/auth/roles.guard';
import { Roles } from '@infrastructure/auth/roles.decorator';
import { RolUsuario } from '@domain/entities/usuario.entity';
import { IServicioRepository } from '@application/ports/servicio.repository';
import { IProductoRepository } from '@application/ports/producto.repository';
import { IVehiculoRepository } from '@application/ports/vehiculo.repository';
import { IRecordatorioRepository } from '@application/ports/recordatorio.repository';
import { IMovimientoKardexRepository } from '@application/ports/movimiento-kardex.repository';
import { RegistrarServicioUseCase } from '@application/use-cases/registrar-servicio.use-case';
import { CalculoProximoCambioService } from '@domain/services/calculo-proximo-cambio.service';
import { RegistrarServicioDto } from '../dto/registrar-servicio.dto';

interface AuthRequest {
  user: {
    sub: string;
    email: string;
    rol: string;
  };
}

@Controller('servicios')
@UseGuards(JwtGuard, RolesGuard)
export class ServiciosController {
  constructor(
    @Inject('IServicioRepository')
    private servicioRepository: IServicioRepository,
    @Inject('IProductoRepository')
    private productoRepository: IProductoRepository,
    @Inject('IVehiculoRepository')
    private vehiculoRepository: IVehiculoRepository,
    @Inject('IRecordatorioRepository')
    private recordatorioRepository: IRecordatorioRepository,
    @Inject('IMovimientoKardexRepository')
    private movimientoKardexRepository: IMovimientoKardexRepository
  ) { }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC)
  async obtenerTodos(): Promise<any[]> {
    const servicios = await this.servicioRepository.obtenerTodos();
    return servicios.map((s) => this.mapearRespuesta(s));
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.MECHANIC)
  async obtenerPorId(@Param('id') id: string): Promise<any> {
    const servicio = await this.servicioRepository.obtenerPorId(id);
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }
    return this.mapearRespuesta(servicio);
  }

  @Post()
  @Roles(RolUsuario.ADMIN, RolUsuario.MECHANIC)
  async registrar(
    @Body() dto: RegistrarServicioDto,
    @Request() req: AuthRequest
  ): Promise<any> {
    const calculoService = new CalculoProximoCambioService();
    const useCase = new RegistrarServicioUseCase(
      this.servicioRepository,
      this.productoRepository,
      this.vehiculoRepository,
      this.recordatorioRepository,
      this.movimientoKardexRepository,
      calculoService
    );

    const servicio = await useCase.ejecutar({
      vehiculoId: dto.vehiculoId,
      clienteId: dto.clienteId,
      mecanicoId: req.user.sub,
      kmRegistrado: dto.kmRegistrado,
      descripcion: dto.descripcion,
      detalles: dto.detalles,
      tipo: dto.tipo,
      proximoCambioKm: dto.proximoCambioKm,
      proximoCambioFecha: dto.proximoCambioFecha,
      piezaReemplazada: dto.piezaReemplazada,
    });

    return this.mapearRespuesta(servicio);
  }

  @Patch(':id/completar')
  @Roles(RolUsuario.ADMIN, RolUsuario.MECHANIC)
  async completar(@Param('id') id: string): Promise<any> {
    const servicio = await this.servicioRepository.obtenerPorId(id);
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }

    servicio.completar();
    const actualizado = await this.servicioRepository.actualizar(servicio);
    return this.mapearRespuesta(actualizado);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.servicioRepository.eliminar(id);
  }

  private mapearRespuesta(servicio: any): any {
    return {
      id: servicio.id,
      vehiculoId: servicio.vehiculoId,
      clienteId: servicio.clienteId,
      mecanicoId: servicio.mecanicoId,
      kmRegistrado: servicio.kmRegistrado,
      descripcion: servicio.descripcion,
      detalles: servicio.detalles.map((d: any) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario:
          typeof d.precioUnitario === 'object'
            ? d.precioUnitario.getValue()
            : d.precioUnitario,
      })),
      estado: servicio.estado,
      costoTotal:
        typeof servicio.costoTotal === 'object'
          ? servicio.costoTotal.getValue()
          : servicio.costoTotal,
      creadoEn: servicio.creadoEn,
      actualizadoEn: servicio.actualizadoEn,
      completadoEn: servicio.completadoEn,
    };
  }
}

