'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 服务是否正常查询
  router.get('cron', '/', controller.cron.index);

  // 客户端相关
  router.get('home', '/home/getUserCardlist', controller.home.getUserCardlist);
  // router.resources('admin/home', '/admin/home', controller.home);
  router.resources('user', '/user', controller.user);


  // 运营相关
  router.resources('admin/users', '/admin/users/resultful', controller.user);
  router.get('admin/users', '/admin/users/fuzzySearch', controller.user.fuzzySearch);
  router.get('admin/users', '/admin/users/index', controller.user.index);

  router.get('admin/auth/info', '/admin/auth/info', controller.studentInfo.getList);
  router.post('admin/auth/verify', '/admin/auth/verify', controller.studentInfo.verify);


  router.resources('activity', '/activity', controller.activity);
};
