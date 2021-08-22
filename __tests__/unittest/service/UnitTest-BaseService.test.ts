import BaseService from '../../../src/service/BaseService';

describe('service/BaseService.', () => {
  describe('generateResponse(ctx: Context | any, status: number, message: string, data = null)', () => {
    it('status:200, message: OK, data: null', () => {
      // arrange
      const baseController = new BaseService();
      const ctxReq = {};
      const status = 200;
      const message = 'OK';
      const data = null;

      // act
      const response = baseController.generateResponse(
        ctxReq,
        status,
        message,
        data,
      );

      // assert
      expect(response.status).toEqual(status);
      expect((<any>(response.body)).message).toEqual(message);
    });
    it('status:400, message: Invalid Input, data: null', () => {
      // arrange
      const baseController = new BaseService();
      const ctxReq = {};
      const status = 400;
      const message = 'Invalid Input';
      const data = null;

      // act
      const response = baseController.generateResponse(
        ctxReq,
        status,
        message,
        data,
      );

      // assert
      expect(response.status).toEqual(status);
      expect((<any>(response.body)).message).toEqual(message);
    });
  });
  describe('generateOk(Context)', () => {
    it('200: OK', () => {
      // act
      const ctx = new BaseService().generate200Ok({});
      expect(ctx.status).toEqual(200);

      // assert
      expect((<any>(ctx.body)).message).toEqual('OK');
    });
  });
  describe('generateRequestInvalid(Context, string)', () => {
    it('400: invalid input with errors', () => {
      // arrange
      const errors = [
        {
          target: {
            email: 'leo.cai@aplt.com',
            username: 'LeoCai',
            password: '12',
          },
          value: '12',
          property: 'password',
          children: [],
          constraints: {
            isLength: 'password must be longer than or equal to 6 characters',
          },
        },
      ];

      // act
      const ctx = new BaseService().generate400RequestInvalid({}, errors);

      // assert
      expect(ctx.status).toEqual(400);
      expect((<any>(ctx.body)).message).toEqual('Invalid Request');
      expect((<any>(ctx.body)).data).toMatchObject(errors);
    });
  });
  describe('generateInternalError(Context, string)', () => {
    it('500: generate internal error response', () => {
      // arrange
      const error = '';

      // act
      const ctx = new BaseService().generate500InternalError({}, error);

      // assert
      expect(ctx.status).toEqual(500);
      expect((<any>(ctx.body)).message).toEqual(error);
    });
  });
});
