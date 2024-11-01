// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// node.js
import { readdirSync, stat, statSync } from "node:fs";
import { extname, join } from "node:path";
import { core_router } from "./router.mjs";


// 导入目录下所有模块
export const loader_all_mjs_by_directory = async (directory, root_path = '') => {

  // 保存根目录
  if (!root_path) {
    root_path = directory;
  }

  // 读取目录下所有文件
  const files = readdirSync(directory);

  // 遍历
  for (const file of files) {

    // 计算文件路径
    const filePath = join(directory, file);

    // 获取文件元信息
    const stat = statSync(filePath);

    // 判断是否是目录
    if (stat.isDirectory()) {
      // 如果是目录

      // 递归
      await loader_all_mjs_by_directory(filePath, root_path);
    } else if (file.endsWith('.mjs')) {
      // 如果不是目录，那就是文件，且后缀名为.mjs

      // 前缀
      let first_char = file.slice(0, 1);
      if (['.'].indexOf(first_char) == -1) {
        try {

          // 获取模块路径对应的url
          let url = filePath.split(root_path)[1].slice(0, -4);
          if (url.slice(-6) == '_index') {
            url = url.slice(0, -6);
          }

          console.log("load module: " + filePath);

          // load module
          let module = await import(filePath);

          // 检验模块
          if (typeof(module.default) != 'undefined' && typeof(module.default.routes) != 'undefined' && typeof(module.default.allowedMethods) != 'undefined') {

            // 挂载路由
            core_router.use(url, module.default.routes(), module.default.allowedMethods());
          }
        } catch(error) {
          console.error('Error importing module:', error);
        }
      }
    }
  }

  return;
};
