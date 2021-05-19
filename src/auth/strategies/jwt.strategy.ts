import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

const extractJwtFromCookies = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractJwtFromCookies,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
