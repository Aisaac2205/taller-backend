import { IsEnum, IsString, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsEnum(['ACEITE', 'FILTRO', 'OTRO'])
  tipo!: string;

  @IsString()
  marca!: string;

  @IsString()
  presentacion!: string;

  @IsNumber()
  costoUnitario!: number;

  @IsNumber()
  margenPorcentaje!: number;

  @IsNumber()
  stockActual!: number;
}

