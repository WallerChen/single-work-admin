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
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1676268731604_5355';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    sequelize: {
      dialect: 'mysql',
      host: 'sh-cynosdbmysql-grp-mt21sa7w.sql.tencentcdb.com',
      port: 25858,
      database: 'school_yearbook',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
