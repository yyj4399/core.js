// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// sdk
import Router from "npm:koa-router";

// 路由实例
const router = new Router();
export default router;

// get /
router.all('/', async (ctx, next) => {
  try {
    let data = {};
    let get = ctx.request.query;
    let post = ctx.request.body;
    let params = {...get, ...post};

    ctx.body =  { code: 400 };
  } catch (error) {
    await next();
  }
});
