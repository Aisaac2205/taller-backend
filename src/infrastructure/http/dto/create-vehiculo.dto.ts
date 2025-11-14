import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateVehiculoDto {
  @IsUUID()
  clienteId!: string;

  @IsString()
  placa!: string;

  @IsString()
  marca!: string;

  @IsString()
  modelo!: string;

  @IsNumber()
  anio!: number;

  @IsNumber()
  kmActual!: number;
}

