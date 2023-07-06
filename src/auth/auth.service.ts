import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { LoginDto } from '../auth/dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUserByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.email };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
