'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Activity = app.model.define('activity', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING,
    // 价格
    price: STRING,
    // 详细内容
    content: TEXT,
    // 举办方
    organizer: STRING,
    // 图片
    images: TEXT,
    created_at: DATE,
    updated_at: DATE,
  });
  (async () => {
    await Activity.sync({ alter: true });
  })();
  // console.log(Object.keys(app.Sequelize));
  // console.log(Activity === app.Sequelize.models.activity); // true
  console.log('活动表同步！');
  return Activity;
};
