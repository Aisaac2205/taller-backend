import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_SECRET debe estar configurado y tener al menos 32 caracteres'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'], // Especificar algoritmo explícitamente
      issuer: 'taller-api',
      audience: 'taller-client',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Validar que el payload tenga los campos requeridos
    if (!payload.sub || !payload.email || !payload.rol) {
      throw new UnauthorizedException('Token inválido: campos faltantes');
    }

    // Validar que el token no haya expirado (passport-jwt ya lo hace, pero por seguridad)
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expirado');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      rol: payload.rol,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}

