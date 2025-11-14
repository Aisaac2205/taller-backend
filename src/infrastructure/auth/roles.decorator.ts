import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '@domain/entities/usuario.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RolUsuario[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);

