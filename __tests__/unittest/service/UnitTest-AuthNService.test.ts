import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import AuthNService from '../../../src/service/AuthNService';
import { User, UserEntity } from '../../../src/entity/User';

const minute2millisecond = 60000;
const authNService = new AuthNService();

const checkUserToken = (
  token: string,
  user: User,
  startTime: number,
  endTime: number,
) :void => {
  const jwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
  expect(jwtPayload?.userId).toEqual(user.userId);
  expect(jwtPayload?.username).toEqual(user.username);
  expect(jwtPayload?.permissions).toMatchObject(Array.from(user.permissions));
  expect(jwtPayload?.expirationTime)
    .toBeGreaterThanOrEqual(startTime + 15 * minute2millisecond);
  expect(jwtPayload?.expirationTime)
    .toBeLessThanOrEqual(endTime + 15 * minute2millisecond);
  expect(jwtPayload?.refreshBefore)
    .toBeGreaterThanOrEqual(jwtPayload?.expirationTime + 44 * minute2millisecond);
  expect(jwtPayload?.refreshBefore)
    .toBeLessThanOrEqual(jwtPayload?.expirationTime + 46 * minute2millisecond);
};

describe('service/AuthenticationService.', () => {
  describe('generateUserToken = (user: User)', () => {
    it('Given: valid user. Return: valid token', () => {
      // arrange
      const userId = uuid();
      const username = 'username';
      const user = new UserEntity({
        userId,
        username,
        permissions: ['aplt-login', 'aplt-project', 'aplt-auto-search'],
      });

      // act
      const timeBeforeAct = Date.now();
      const token = authNService.generateUserToken(user);
      const timeAfterAct = Date.now();

      // assert
      checkUserToken(token, user, timeBeforeAct, timeAfterAct);
    });
  });

  describe('refreshToken(user: User)', () => {
    it('Given a token before refresh time then create another valid token', () => {
      // arrange
      const userId = uuid();
      const username = 'username';
      const user = new UserEntity({
        userId,
        username,
      });
      const oldToken = jwt.sign({
        userId: user.userId,
        username: user.username,
        expirationTime: Date.now() - 15 * minute2millisecond,
        refreshBefore: Date.now() + 15 * minute2millisecond,
      }, process.env.TOKEN_SECRET as string);

      // act
      const timeBeforeAct = Date.now();
      const newToken = authNService.refreshToken(oldToken) as string;
      const timeAfterAct = Date.now();

      // assert
      checkUserToken(newToken, user, timeBeforeAct, timeAfterAct);
    });
  });
});
