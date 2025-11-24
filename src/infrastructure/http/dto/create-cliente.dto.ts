import { IsEmail, IsOptional, IsString, Matches, Length } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Length(8, 8, { message: 'El teléfono debe tener exactamente 8 dígitos' })
  @Matches(/^\d+$/, { message: 'El teléfono solo debe contener números' })
  telefono!: string;

  @IsString()
  direccion!: string;
}

