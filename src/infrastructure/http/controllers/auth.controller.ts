import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { JwtGuard } from '@infrastructure/auth/jwt.guard';
import { IUsuarioRepository } from '@application/ports/usuario.repository';

interface AuthRequest {
  user: {
    sub: string;
    email: string;
    rol: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    @Inject('IUsuarioRepository')
    private usuarioRepository: IUsuarioRepository
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<{
    access_token: string;
    usuario: {
      id: string;
      email: string;
      nombre: string;
      rol: string;
    };
  }> {
    const usuario = await this.usuarioRepository.obtenerPorEmail(
      loginDto.email
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // En producción, usar bcrypt para verificar password
    // Por ahora, simple comparación de strings para demo
    if (usuario.passwordHash !== loginDto.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email.getValue(),
      rol: usuario.rol,
      iat: Math.floor(Date.now() / 1000), // Issued at
    };

    // Generar JWT con expiración explícita (24 horas)
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '24h',
      algorithm: 'HS256', // Algoritmo seguro
      issuer: 'taller-api',
      audience: 'taller-client',
    });

    return {
      access_token,
      usuario: {
        id: usuario.id,
        email: usuario.email.getValue(),
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Request() req: AuthRequest): Promise<any> {
    const usuario = await this.usuarioRepository.obtenerPorId(req.user.sub);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: usuario.id,
      email: usuario.email.getValue(),
      nombre: usuario.nombre,
      rol: usuario.rol,
      activo: usuario.activo,
    };
  }
}

