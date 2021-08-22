import Router from 'koa-router';
import { v4 as uuid } from 'uuid';
import BaseService from '../service/BaseService';
import { HealthEntity } from '../entity/Health';
import HealthCheckRequest from '../request/HealthCheckRequest';
import { getConfig } from '../Configs';

const Authorise = require('../middleware/Authorise');

const router = new Router();
const service = new BaseService();

router.get('/health-check', async (ctx) => {
  service.generate200Ok(ctx, {
    environment: getConfig().env,
    port: getConfig().port,
    database: getConfig().dbConn,
  });
});
router.post('/health-check', async (ctx) => {
  try {
    const request = new HealthCheckRequest(ctx.request.rawBody);
    const id = uuid();
    if (!request.isCheckingDatabase) {
      service.generate200Ok(ctx, {
        environment: getConfig().env,
        database: 'checking ignored',
      });
    } else {
      const health = new HealthEntity({
        id,
        message: request.message,
      });
      await health.save();
      const tempHealthEntity = HealthEntity.findOne({ id });
      if (tempHealthEntity) {
        tempHealthEntity.deleteOne();
        service.generate200Ok(ctx, {
          environment: getConfig().env,
          database: 'healthy',
        });
      }
    }
  } catch (err) {
    service.generate500InternalError(ctx, err);
  }
});

router.get('/auth-check', Authorise, async (ctx) => {
  try {
    service.generate200Ok(ctx);
  } catch (err) {
    service.generate500InternalError(ctx, err);
  }
});

export default router;
