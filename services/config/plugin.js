'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  cors:{
    enable: true,
    package: 'egg-cors',
  },
  static: {
    enable: true,//是否启用
    package: "egg-static",//插件包名
    // path:"",//自定义插件 跟package只能出现一个
  }
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
};
