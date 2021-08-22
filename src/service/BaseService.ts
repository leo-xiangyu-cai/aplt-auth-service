import { validate } from 'class-validator';
import { Context } from 'koa';

export default class BaseService {
  validate = async (request: any) => validate(request, {});

  generate200Ok = (
    ctx: Context | any,
    data: object | null = null,
  ): Context => this.generateResponse(ctx, 200, 'OK', data);

  generate400RequestInvalid = (ctx: Context | any, errors: object | string): Context => {
    ctx.status = 400;
    ctx.body = { message: 'Invalid Request' };
    if (errors != null) (<any>(ctx.body)).data = errors;
    return ctx;
  };

  generate401Unauthorized = (ctx: Context | any, message: string): Context => {
    ctx.status = 401;
    ctx.body = { message };
    return ctx;
  };

  generate500InternalError = (ctx: Context | any, error: string): Context => {
    ctx.status = 500;
    ctx.body = { message: `${error}` };
    return ctx;
  };

  generateResponse = (
    ctx: Context | any,
    status: number,
    message: string,
    data: object | null = null,
  ): Context => {
    ctx.status = status;
    ctx.body = { message };
    if (data) (<any>(ctx.body)).data = data;
    return ctx;
  };
}
