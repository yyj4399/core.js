// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";
import { store_captcha } from "#src/store/captcha.mjs";

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

router.get('/captcha.svg', async(ctx, next) => {
  let data = {};
  let params = {...ctx.request.query, ...ctx.request.body};

  // 验证输入
  if (typeof(params.captcha_key) == 'undefined' || !/^\w{10}$/.test(params.captcha_key)) {
    params.captcha_key = Math.random().toString(36).slice(-10);
  }

  // 创建验证码
  let captcha = await store_captcha.create_captcha(params.captcha_key);

  // 设置返回类型为svg
  ctx.set('content-type', 'image/svg+xml');
  // 返回svg图片
  ctx.body = captcha.data;
});

// 验证码中间件
export const captcha_middleware = async (ctx, next) => {
  let data = {};
  let params = {...ctx.request.query, ...ctx.request.body};

  ctx.state.refresh_captcha = 1;

  // 验证输入
  if (typeof(params.captcha_key) == 'undefined' || !/^\w{10}$/.test(params.captcha_key)) {
    return route_func.adminError(ctx, 403, 'param - captcha_key', 'failed', data);
  }
  if (typeof(params.captcha_value) == 'undefined' || !/^\w{1,6}$/.test(params.captcha_value)) {
    return route_func.adminError(ctx, 403, 'param - captcha_value', 'failed', data);
  }

  let res_check = await store_captcha.check_captcha(params.captcha_key, params.captcha_value);

  // 验证
  if (!res_check) {
    return route_func.adminError(ctx, 403, 'captcha error', 'failed', data);
  }

  return await next();
};
