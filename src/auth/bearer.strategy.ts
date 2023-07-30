import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(token: string): Promise<User> {
    let user: User;
    try {
      const payload = await this.jwtService.verify(token);
      user = await this.authService.validateUser(payload);
    } catch (e) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
    return user;
  }
}
