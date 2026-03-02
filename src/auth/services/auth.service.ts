import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';
import { PrismaService } from 'src/lib/prisma';
import { hash, compare } from "bcryptjs"

type AccessTokenPayload = {
  sub: string;
  name: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  private readonly accessTokenTtlSeconds = 60 * 60 * 8;
  private readonly jwtSecret: string;

  constructor(private readonly prisma: PrismaService) {
    this.jwtSecret = process.env.JWT_SECRET!;
    if (!this.jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET nao configurado.');
    }
  }

  async login(name: string, password: string) {
    const parsedName = this.normalizeName(name);
    const parsedPassword = this.validatePassword(password);

    const user = await this.prisma.user.findFirst({
      where: { name: parsedName, active: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const isValidPassword = await compare(parsedPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const accessToken = this.signAccessToken({
      sub: user.id,
      name: user.name,
    });

    return {
      access_token: accessToken.token,
      token_type: 'Bearer',
      expires_in: accessToken.expiresIn,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  async registerUser(name: string, password: string) {
    const parsedName = this.normalizeName(name);
    const parsedPassword = this.validatePassword(password);

    const existingUser = await this.prisma.user.findFirst({
      where: { name: parsedName },
    });

    if (existingUser) {
      throw new ConflictException('Usuario ja existe.');
    }

    const passwordHash = await hash(parsedPassword, 12)
    const user = await this.prisma.user.create({
      data: {
        name: parsedName,
        password: passwordHash,
      },
    });

    return {
      id: user.id,
      name: user.name,
      active: user.active,
    };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Token invalido.');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const rawData = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.base64UrlEncode(
      createHmac('sha256', this.jwtSecret).update(rawData).digest(),
    );

    if (
      !timingSafeEqual(
        Buffer.from(encodedSignature),
        Buffer.from(expectedSignature),
      )
    ) {
      throw new UnauthorizedException('Token invalido.');
    }

    let payload: AccessTokenPayload;
    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf-8'),
      ) as AccessTokenPayload;
    } catch {
      throw new UnauthorizedException('Token invalido.');
    }

    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Token expirado.');
    }

    return payload;
  }

  private signAccessToken(payload: { sub: string; name: string }) {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const now = Math.floor(Date.now() / 1000);
    const body: AccessTokenPayload = {
      sub: payload.sub,
      name: payload.name,
      iat: now,
      exp: now + this.accessTokenTtlSeconds,
    };

    const encodedHeader = this.base64UrlEncode(
      Buffer.from(JSON.stringify(header)),
    );
    const encodedPayload = this.base64UrlEncode(
      Buffer.from(JSON.stringify(body)),
    );
    const rawData = `${encodedHeader}.${encodedPayload}`;
    const signature = this.base64UrlEncode(
      createHmac('sha256', this.jwtSecret).update(rawData).digest(),
    );

    return {
      token: `${rawData}.${signature}`,
      expiresIn: this.accessTokenTtlSeconds,
    };
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) {
      return false;
    }

    const currentHash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(originalHash), Buffer.from(currentHash));
  }

  private normalizeName(name: string): string {
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('Campo name obrigatorio.');
    }

    const parsed = name.trim();
    if (parsed.length < 3) {
      throw new BadRequestException('Campo name deve ter ao menos 3 caracteres.');
    }

    return parsed;
  }

  private validatePassword(password: string): string {
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Campo password obrigatorio.');
    }

    const parsed = password.trim();
    if (parsed.length < 8) {
      throw new BadRequestException(
        'Campo password deve ter ao menos 8 caracteres.',
      );
    }

    return parsed;
  }

  private base64UrlEncode(value: Buffer): string {
    return value.toString('base64url');
  }
}
