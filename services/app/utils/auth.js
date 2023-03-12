'use strict';
// 鉴权相关逻辑

module.exports = {
  // 错误码
  ErrorCode: {
    // 逻辑正常
    SUC: 0,
    // 没有数据
    NO_RESULT: 10000,
    // 未知错误
    ERROR: 10001,
  },
  // 校验方法（手工）
  validatorValue(obj) {
    return !Object.values(obj).includes(undefined);
  },
  // 业务鉴权逻辑 当前用户是否能读当前班级信息
  async checkUserHaveLook(ctx, openid, cls) {
    const canShow = await ctx?.model.User.findOne({ where: { openid, collection: cls } });
    console.log('canShow:' + !!canShow);
    return !!canShow;
  },
};
