import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, jwtVerify } from 'jose';

@Injectable()
export class AuthService {
  private readonly secret: Uint8Array;

  constructor(private readonly config: ConfigService) {
    const secret = this.config.get<string>('jwtSecret') || 'default-secret-change-me';
    this.secret = new TextEncoder().encode(secret);
  }

  async createToken(payload: Record<string, unknown>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(this.secret);
  }

  async verifyToken(token: string): Promise<Record<string, unknown>> {
    const { payload } = await jwtVerify(token, this.secret, { clockTolerance: 60 });
    return payload as Record<string, unknown>;
  }
}
