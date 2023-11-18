import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<{ message: string }> {
    const hash = await argon.hash(dto.password);
    try {
      await this.createUser(dto.email, hash);
      return { message: 'Signup successful' };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async signin(dto: AuthDto, res: Response): Promise<{ message: string }> {
    const user = await this.validateUser(dto);
    const jwt = await this.signToken(user.id, user.email);
    res.cookie('jwt', jwt, { httpOnly: true });
    return { message: 'Signin successful' };
  }

  private async createUser(email: string, hash: string) {
    return await this.prisma.user.create({
      data: { email, hash },
    });
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await argon.verify(user.hash, dto.password))) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return user;
  }

  private handleDatabaseError(error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ForbiddenException('Credentials taken');
    }
    throw new InternalServerErrorException('An internal server error occurred');
  }

  private async signToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    return await this.jwt.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });
  }
}
