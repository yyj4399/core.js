// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// sdk
import Router from "npm:koa-router";

// 路由实例
export const core_router = new Router();

// request 中间件
const req_middleware = async (ctx, next) => {
  // do something before
  console.log(ctx.request.ip);

  // next
  await next();
};

// response 中间件
const res_middleware = async (ctx, next) => {
  // next
  await next();

  // do something after
  console.log(ctx.response.body);
};

export const func_router = {
  // 结束http请求并发出响应 成功
  end_ok: (ctx, code = 200, message = 'error', type = 'error', result = {}) => {
    ctx.body = {
      code: code,
      result: result,
      message: message,
      type: type,
      lang: ctx.state.lang,
      time: Date.now(),
    };
  },
  // 结束http请求并发出响应 失败
  end_err: (ctx, code = -1, message = 'error', type = 'error', result = {}) => {
    ctx.body = {
      code: code,
      result: result,
      message: message,
      type: type,
      lang: ctx.state.lang,
      time: Date.now(),
      refresh: {
        captcha: ctx.state.refresh
      },
      refresh_captcha: ctx.state.refresh_captcha,
    };
  },
};

// 使用request和response中间件
core_router.use(req_middleware, res_middleware);
