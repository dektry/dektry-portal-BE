import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { requestUser } from '../auth.interfaces';

const extractJwtFromCookies = (req) => {
  let token = null;
  if (req?.cookies) {
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

  async validate(payload: requestUser) {
    return { ...payload };
  }
}
