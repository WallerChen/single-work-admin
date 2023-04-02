'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    nick_name: STRING(30),
    class: STRING(30),
    class_type: INTEGER,
    collection: STRING(30),
    avatar_url: STRING(2048),
    age: INTEGER,
    sex: STRING(30),
    wxcode: STRING(30),
    // 是否社群用户
    user_type: INTEGER,
    image_list: TEXT,
    desc: TEXT,
    openid: STRING,
    created_at: DATE,
    updated_at: DATE,
    // 运营管理相关
    // 是否推送展现
    is_show: INTEGER,
    // 质量得分
    score: INTEGER,
    // 固定排序
    rank: INTEGER
  });
  (async () => {
    await User.sync({ alter: true });
  })();
  console.log('用户表同步！');
  return User;
};
