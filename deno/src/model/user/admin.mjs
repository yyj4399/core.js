// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// sdk
import { Sequelize, Model, DataTypes, Op } from "sequelize";
import bcryptjs from "bcryptjs";

// database connect
import { sequelize } from "./_base.mjs";

// model name (file name "xxx.mjs")
const model_name = import.meta.url.split('/').slice(-1)[0].slice(0, -4);

// 表结构
const table = {
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
};

// 模型定义
export const x_model = sequelize.define(model_name, table);

// 同步
export const x_sync = async () => {
  // 这会检查数据库中表的当前状态（它有哪些列，它们的数据类型是什么等），然后在表中执行必要的更改以使其与模型匹配。
  await x_model.sync({ alter: true });

  // 检查初始id
  const find_root = await x_model.findOne({
    where: { id: 100000 },
  });
  if (!find_root) {
    // 生成加密盐
    var salt = bcryptjs.genSaltSync(10);
    // 生成加密密码
    var password = bcryptjs.hashSync("123456", salt);
    // 创建
    var user = User.build({
      id: 100000,
      scode: 100000,
      mobile: "1580000000",
      password: password,
      money: 10000000,
      nickname: "root",
      cardId: '123456',
      cardName: 'Abc Cba',
      ifscCode: 'TEST0123456',
      createtime: Math.floor(Date.now() / 1000),
    });
    // 保存
    await user.save();
  }
};

// 初始化
await x_sync();
