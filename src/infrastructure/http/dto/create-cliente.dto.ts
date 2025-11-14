import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  telefono!: string;

  @IsString()
  direccion!: string;
}

