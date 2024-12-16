// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// sdk
import { Sequelize, Model, DataTypes, Op } from "sequelize";

// seq数据库配置
var seq_conf = {
  host: 'psql', // 数据主机地址
  dialect: 'postgres', // 数据库类型
  timezone: '+0:00', // 时区
  // logging: false, // 关闭默认日志输出
  logging: (...msg) => { logger_sql.trace(msg) }, // 默认日志输出
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  pool: {
    max: 5, // 连接池中最大的连接数量
    min: 0, // 最小
    idle: 10000, // 如果一个连接池 10 s 之内没有被使用，则释放
  },
  // 定义
  define: {
    // 默认情况下,当未提供表名时,Sequelize 会自动将模型名复数并将其用作表名.
    // 强制表名称等于模型名称
    freezeTableName: true,
    // 默认情况下,Sequelize 使用数据类型 DataTypes.DATE 自动向每个模型添加 createdAt 和 updatedAt 字段. 这些字段会自动进行管理 - 每当你使用Sequelize 创建或更新内容时,这些字段都会被自动设置. createdAt 字段将包含代表创建时刻的时间戳,而 updatedAt 字段将包含最新更新的时间戳.
    // 对于带有 timestamps: false 参数的模型,可以禁用此行为
    timestamps: false,
  },
};

// 创建 sequelize 实例
export const sequelize = new Sequelize('postgres', 'postgres', '', seq_conf);
