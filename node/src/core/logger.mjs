import log4js from "log4js";

// log4js 配置 返回 log4js
// 默认代码块结束才会写入日志，所以while true死循环可能会导致无法写入
log4js.configure({
  // 附加程序  可以选择输出 const logger = log4js.getLogger("app");
  // 时区问题 https://github.com/log4js-node/log4js-node/issues/1025
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: 'pattern',
        pattern: '[%x{myTime}] [%p] %c - %m',
        tokens: {
          myTime: function (logEvent) {
            return logEvent.startTime.toISOString();
          }
        }
      }
    },
    app: {
      type: "dateFile",
      filename: "logs/app/app.log",
      keepFileExt: true,
      pattern: 'yyyy-MM-dd', // （可选，默认为yyyy-MM-dd） - 用于确定何时滚动日志的模式。
      numBackups: 30,
    },
    sql: {
      type: "dateFile",
      filename: "logs/sql/sql.log", // 您想要写入日志的文件的路径。
      keepFileExt: true, // 滚动日志文件时保留文件扩展名（file.log变为file.2017-05-30.log而不是file.log.2017-05-30）
      pattern: 'yyyy-MM-dd', // （可选，默认为yyyy-MM-dd） - 用于确定何时滚动日志的模式。
      numBackups: 30, // 与模式匹配的要保留的旧文件的数量（不包括热文件）。
    },
  },
  // 类别
  categories: {
    // 默认输出 const logger = log4js.getLogger();
    default: { appenders: ["out"], level: "trace" },
    app: { appenders: ["app"], level: "trace" },
    sql: { appenders: ["sql"], level: "trace" },
  },
});

export const logger = log4js.getLogger('default');

export const logger_app = log4js.getLogger('app');

export const logger_sql = log4js.getLogger('sql');
