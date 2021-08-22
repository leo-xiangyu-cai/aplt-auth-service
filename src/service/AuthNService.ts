import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import BaseService from './BaseService';
import { User, UserEntity } from '../entity/User';

dotenv.config();
export enum TokenType {
  UsernameAndPassword,
  PhoneNumberAndMessageCode,
  Bff2Service,
}
export default class AuthNService extends BaseService {
  generateUserToken = (user: User) => {
    const currentTime = new Date();
    const expiredTime = new Date();
    expiredTime.setMinutes(currentTime.getMinutes() + 15);
    const refreshBefore = new Date();
    refreshBefore.setMinutes(currentTime.getMinutes() + 60);
    const secret = process.env.TOKEN_SECRET as string;
    return jwt.sign({
      userId: user.userId,
      username: user.username,
      permissions: user.permissions,
      expirationTime: expiredTime.getTime(),
      refreshBefore: refreshBefore.getTime(),
    }, secret);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateServiceToken = (googleToken: string) => {
  };

  refreshToken = (token: string): string | null => {
    try {
      const jwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
      if (jwtPayload && jwtPayload.refreshBefore > Date.now()) {
        return this.generateUserToken(new UserEntity({
          userId: jwtPayload.userId,
          username: jwtPayload.username,
          permissions: jwtPayload.permissions,
        }));
      }
      return null;
    } catch {
      return null;
    }
  };
}
