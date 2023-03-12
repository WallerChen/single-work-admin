'use strict';

const { Controller } = require('egg');
const { validatorValue } = require('../utils/auth');
const { RES_ERROR } = require('../utils/general');

class HomeController extends Controller {
  // 卡片展示 首页卡片展示
  async getUserCardlist() {
    const { ctx } = this;
    const { offset, limit, openid, cls } = ctx.request.body;
    if (validatorValue({ offset, limit, openid, cls })) {
      ctx.body = await ctx.service.user.cardList({ offset, limit, openid, cls });
    } else {
      ctx.body = RES_ERROR;
    }
  }
}

module.exports = HomeController;
