import { IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
  @IsUUID()
  productoId!: string;

  @Type(() => Number)
  cantidad!: number;
}

export class RegistrarVentaDto {
  @IsUUID()
  clienteId!: string;

  @IsArray()
  detalles!: DetalleVentaDto[];
}

