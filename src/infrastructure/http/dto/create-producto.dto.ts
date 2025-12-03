import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;

}

