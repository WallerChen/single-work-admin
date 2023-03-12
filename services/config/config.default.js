/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    cluster = {
      listen: {
        path: '',
        port: 7001,
        hostname: '0.0.0.0',
    },
    static: {
      prefix: '/static', 
      dir: path.join(appInfo.baseDir, 'app/public'), // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
      dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
      preload: false,
      maxAge: 31536000, // in prod env, 0 in other envs
      buffer: true, // in prod env, false in other envs
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    }
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1676268731604_5355';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    sequelize: {
      dialect: 'mysql',
      host: 'sh-cynosdbmysql-grp-mt21sa7w.sql.tencentcdb.com',
      port: 25858,
      username: 'root',
      password: 'qwer@123123',
      database: 'school_yearbook',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
