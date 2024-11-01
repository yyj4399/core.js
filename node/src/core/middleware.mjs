// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

export const middleware_auth = async (ctx, next) => {
  await next;
};
