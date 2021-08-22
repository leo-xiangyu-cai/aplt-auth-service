import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import dotenv from 'dotenv';
import Mongo from 'mongoose';
import { Server } from 'http';
import healthCheckRoutes from './controller/HealthCheckController';
import { getConfig } from './Configs';
import BlockPrinter from './util/BlockPrinter';

export default class KoaApp {
  port: number;

  app: Koa;

  dbConnect : string = '';

  private server? : Server;

  constructor() {
    dotenv.config();
    this.app = new Koa();
    this.dbConnect = getConfig().dbConn;
    this.port = getConfig().port;
    Mongo.connect(this.dbConnect, { useNewUrlParser: true, useUnifiedTopology: true }, () => { });
    this.app.use(bodyParser());
    this.app.use(
      cors({
        origin: '*',
      }),
    );
    this.app.use(logger());

    this.app.use(healthCheckRoutes.routes());
  }

  start() {
    const blockPrinter = new BlockPrinter('Auth Service');
    blockPrinter.push(`url:     http://localhost:${this.port}`);
    blockPrinter.push(`env:     ${process.env.ENVIRONMENT}`);
    blockPrinter.push(`port:    ${this.port}`);
    blockPrinter.push(`db:      ${this.dbConnect}`);
    this.server = this.app.listen(this.port, async () => {
      blockPrinter.push('status:  running');
      blockPrinter.print();
    })
      .on('error', (err) => {
        blockPrinter.push('status: error');
        blockPrinter.print();
        // eslint-disable-next-line no-console
        console.error(err);
      });
    return this.server;
  }

  stop = () => {
    Mongo.connection.close().then();
    this.server?.close();
  };
}
