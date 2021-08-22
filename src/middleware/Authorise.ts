import { Context, Next } from 'koa';
import { JwtPayload, verify } from 'jsonwebtoken';
import BaseService from '../service/BaseService';

module.exports = async (ctx: Context, next: Next): Promise<void> => {
  const token = ctx.request.headers.authorization as string;
  const service = new BaseService();
  try {
    const jwtPayload = verify(token.replace('Bearer ', ''), process.env.TOKEN_SECRET as string) as JwtPayload;
    if (jwtPayload.expirationTime > Date.now()) {
      ctx.jwtPayload = jwtPayload;
      await next();
    } else {
      service.generate401Unauthorized(ctx, 'token is expired');
    }
  } catch (e) {
    service.generate401Unauthorized(ctx, 'invalid token');
  }
};
