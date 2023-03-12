'use strict';

const { Controller } = require('egg');
const { validatorValue } = require('../utils/auth');
const { RES_ERROR } = require('../utils/general');

class HelloController extends Controller {
  // 卡片展示 首页卡片展示
  async index() {
    const ctx = this.ctx;
    ctx.body = 'Hello World';
  }
}

module.exports = HelloController;
