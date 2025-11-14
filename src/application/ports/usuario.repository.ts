import { UsuarioEntity, RolUsuario } from '@domain/entities/usuario.entity';

export interface IUsuarioRepository {
  crear(usuario: UsuarioEntity): Promise<UsuarioEntity>;
  obtenerPorId(id: string): Promise<UsuarioEntity | null>;
  obtenerPorEmail(email: string): Promise<UsuarioEntity | null>;
  obtenerTodos(): Promise<UsuarioEntity[]>;
  obtenerPorRol(rol: RolUsuario): Promise<UsuarioEntity[]>;
  actualizar(usuario: UsuarioEntity): Promise<UsuarioEntity>;
  eliminar(id: string): Promise<void>;
}
