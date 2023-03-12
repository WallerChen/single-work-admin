'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    await queryInterface.createTable('activity', {
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
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('activity');
  },
};
