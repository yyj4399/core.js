// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// node.js
import http from "node:http";
import path from "node:path";
import url from "node:url";

// sdk
import Koa from "npm:koa";
import cors from "npm:@koa/cors";
import Router from "npm:koa-router";
import KoaStatic from 'npm:koa-static';
import koaBodyparser from "npm:koa-bodyparser";

// core
import { loader_all_mjs_by_directory } from "#src/core/_loader.mjs";
import { core_router } from "#src/core/router.mjs";

// static val
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建一个 web服务 实例
export const app = new Koa({ proxy: true });

// 使用cors中间件
app.use(cors());

// cookie
app.use(async (ctx, next) => {
  ctx.set({
    'Server': 'Nginx 1.0',
    'SameSite': 'None',
  });
  return await next();
});

// 使用post数据中间件
app.use(koaBodyparser());

// 静态资源路径
app.use(KoaStatic('./public', {
  hidden: true, // 允许访问隐藏文件
}));

// // 图形验证码中间件
// app.use(captcha_middleware());

// 动态载入目录下所有路由模块
// 加上await 等待所有模块载入完成再启动
await loader_all_mjs_by_directory(__dirname + "/router");

// 路由到控制器
app.use(core_router.routes());
app.use(core_router.allowedMethods());

// 创建http服务器
export const server = http.createServer(app.callback());
// 启动server
server.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Web Server started at http://%s:%s", host, port);
});

// 定时任务
// await start_timer(server);
