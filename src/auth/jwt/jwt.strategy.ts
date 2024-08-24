import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    if (!userId) {
      throw new UnauthorizedException('Token payload does not contain user ID.');
    }

    const user = await this.authService.validateUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }
}
