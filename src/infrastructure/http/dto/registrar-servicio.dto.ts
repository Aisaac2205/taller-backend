import { IsUUID, IsNumber, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleServicioDto {
  @IsUUID()
  productoId!: string;

  @Type(() => Number)
  @IsNumber()
  cantidad!: number;
}

export class RegistrarServicioDto {
  @IsUUID()
  vehiculoId!: string;

  @IsUUID()
  clienteId!: string;

  @IsNumber()
  kmRegistrado!: number;

  @IsString()
  descripcion!: string;

  @IsArray()
  detalles!: DetalleServicioDto[];
}

