import {
  Controller,
  Get,
  Post,
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
import { IVentaRepository } from '@application/ports/venta.repository';
import { IProductoRepository } from '@application/ports/producto.repository';
import { IMovimientoKardexRepository } from '@application/ports/movimiento-kardex.repository';
import { RegistrarVentaUseCase } from '@application/use-cases/registrar-venta.use-case';
import { RegistrarVentaDto } from '../dto/registrar-venta.dto';

interface AuthRequest {
  user: {
    sub: string;
    email: string;
    rol: string;
  };
}

@Controller('ventas')
@UseGuards(JwtGuard, RolesGuard)
export class VentasController {
  constructor(
    @Inject('IVentaRepository')
    private ventaRepository: IVentaRepository,
    @Inject('IProductoRepository')
    private productoRepository: IProductoRepository,
    @Inject('IMovimientoKardexRepository')
    private movimientoKardexRepository: IMovimientoKardexRepository
  ) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.RECEPCION)
  async obtenerTodos(): Promise<any[]> {
    const ventas = await this.ventaRepository.obtenerTodos();
    return ventas.map((v) => this.mapearRespuesta(v));
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.OWNER, RolUsuario.RECEPCION)
  async obtenerPorId(@Param('id') id: string): Promise<any> {
    const venta = await this.ventaRepository.obtenerPorId(id);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }
    return this.mapearRespuesta(venta);
  }

  @Post()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCION)
  async registrar(
    @Body() dto: RegistrarVentaDto,
    @Request() req: AuthRequest
  ): Promise<any> {
    const useCase = new RegistrarVentaUseCase(
      this.ventaRepository,
      this.productoRepository,
      this.movimientoKardexRepository
    );

    const venta = await useCase.ejecutar({
      clienteId: dto.clienteId,
      usuarioId: req.user.sub,
      detalles: dto.detalles,
    });

    return this.mapearRespuesta(venta);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.ventaRepository.eliminar(id);
  }

  private mapearRespuesta(venta: any): any {
    return {
      id: venta.id,
      clienteId: venta.clienteId,
      usuarioId: venta.usuarioId,
      detalles: venta.detalles.map((d: any) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario:
          typeof d.precioUnitario === 'object'
            ? d.precioUnitario.getValue()
            : d.precioUnitario,
      })),
      estado: venta.estado,
      costoTotal:
        typeof venta.costoTotal === 'object'
          ? venta.costoTotal.getValue()
          : venta.costoTotal,
      creadoEn: venta.creadoEn,
      actualizadoEn: venta.actualizadoEn,
      completadaEn: venta.completadaEn,
    };
  }
}

