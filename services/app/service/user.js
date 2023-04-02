'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');
const { checkUserHaveLook } = require('../utils/auth');
const { RES } = require('../utils/general');


class User extends Service {
  // 根据openID查找相关用户
  async getUser({ openid }) {
    return this.ctx.model.User.findOne({ where: { openid } });
  }
  //  小程序客户端相关
  async cardList({ offset, limit, openid, cls }) {
    const canShow = await checkUserHaveLook(this.ctx, openid, cls);
    if (canShow) {
      const result = await this.ctx.model.User.findAndCountAll({
        attributes: [ 'nick_name', 'sex', 'desc', 'class', 'image_list' ],
        where: {
          collection: cls,
        },
        offset,
        limit,
        order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
      });
      RES.data = result;
      return RES;
    }
    return RES;
  }

  // 运营管理相关

  // 获取不同班级的用户信息
  async getUserInfoByGroup({ offset = 0, limit = 10, cls = '' }) {
    return this.ctx.model.User.findAndCountAll({
      where: {
        collection: cls,
      },
      // offset,
      // limit,
      order: [[ 'rank', 'desc' ], [ 'score', 'desc' ] ,[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }
  // 模糊匹配用户昵称
  async getUserInfoByNickname(nickName) {
    return this.ctx.model.User.findAndCountAll({
      where: {
        nick_name: { [Op.substring]: nickName },
      },
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.User.findAndCountAll({
      offset,
      limit,
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  async find(id) {
    const user = await this.ctx.model.User.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  async update({ id, updates }) {
    const user = await this.ctx.model.User.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id) {
    const user = await this.ctx.model.User.findByPk(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }
}

module.exports = User;
