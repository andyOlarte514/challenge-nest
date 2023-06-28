import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'hard!to-guess_secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.getUserByEmail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
