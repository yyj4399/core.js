// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// sdk
import { Sequelize, Model, DataTypes, Op } from "sequelize";

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

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// 声明模型类
class struct_test extends Model {};

// 模型类初始化
// 可用数据类型
// https://www.sequelize.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
struct_test.init({
  id: {
    // 类型
    type: DataTypes.BIGINT,
    // 自动增长
    autoIncrement: true,
    // 主键
    primaryKey: true,
  },
  // 如果关于列的唯一指定内容是其数据类型,则可以缩短语法
  name: DataTypes.STRING,
  // 时间
  createtime: {
    // 类型
    type: DataTypes.BIGINT,
    // 默认情况下,Sequelize 假定列的默认值为 NULL. 可以通过将特定的 defaultValue 传递给列定义来更改此行为
    defaultValue: 0,
    // 默认允许空，不允许为空
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  // 我们需要传递连接实例
  sequelize,
  // 我们需要选择模型名称
  modelName: 'test',
});

// User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
// User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.

// sync和drop操作是破坏性的. Sequelize 使用 match 参数作为附加的安全检查,该检查将接受 RegExp：

// // 仅当数据库名称以 '_test' 结尾时,它才会运行.sync()
// sequelize.sync({ force: true, match: /_test$/ });

await sequelize.sync({ alter: true });
console.log("所有模型均已成功同步.");

// const test = struct_test.build({
//   name: "jack",
//   createtime: Date.now(),
// });
// await test.save();
