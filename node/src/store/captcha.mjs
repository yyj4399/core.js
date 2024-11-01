// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

import { create as svg_create, createMathExpr as svg_createMathExpr } from "svg-captcha";

import { cache_func } from "#src/core/cache.mjs";

// 缓存数据 验证码
export const store_captcha = {
  // 创建图形验证码
  create_captcha: async (key) => {
    // 创建图形验证码svg
    let captcha = svg_createMathExpr({
      // size: 4,
      // ignoreChars: '0o1i',
      noise: 1,
      // color: true, //字符将具有不同的颜色而不是灰色，如果设置了背景选项，则为 true
      // background: '#cc9966',
    });

    // 缓存
    await cache_func.set('captcha_key_' + key, captcha.text, 600);

    logger_app.trace('captcha_key_' + key, await cache_func.get('captcha_key_' + key));

    return captcha;
  },
  // 验证图形验证码
  check_captcha: async (key, code) => {
    // 输入不能为空
    if (!code) {
      return false;
    }

    // 获取
    let value = await cache_func.get('captcha_key_' + key);
    if (value && code.toLowerCase() == value.toLowerCase()) {
      // 删除
      await cache_func.del('captcha_key_' + key);
      // 备份
      await cache_func.set('captcha_key2_' + key, value, 600);
      // 返回验证结果
      return true;
    }

    // 验证失败
    return false;
  },
  // 验证图形验证码double
  check_captcha_2: async (key, code) => {
    // 输入不能为空
    if (!code) {
      return false;
    }

    // 获取
    let value = await cache_func.get('captcha_key_' + key);
    if (value && code.toLowerCase() == value.toLowerCase()) {
      // 删除
      await cache_func.del('captcha_key_' + key);
      // 备份
      await cache_func.set('captcha_key2_' + key, value, 600);
      // 返回验证结果
      return true;
    }

    // 获取 2
    value = await cache_func.get('captcha_key2_' + key);
    if (value && code.toLowerCase() == value.toLowerCase()) {
      // 删除
      await cache_func.del('captcha_key2_' + key);
      // 返回验证结果
      return true;
    }

    // 验证失败
    return false;
  },
};
