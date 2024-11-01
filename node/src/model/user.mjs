// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

export const func_user = {
  // 创建用户
  create_user: async (ctx, params = { password: '' }) => {
    // # 创建用户

    // ## 默认参数
    // ### 密码
    if (!params.password) {
      params.password = '';
    }
    // ### 邀请码
    if (!params.scode) {
      params.password = '';
    }
  },
};
