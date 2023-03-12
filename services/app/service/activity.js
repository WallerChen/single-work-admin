'use strict';

const Service = require('egg').Service;

class Activity extends Service {
  // 运营管理
  async list({ offset = 0, limit = 10, user_id }) {
    const options = {
      offset,
      limit,
      attributes: [ 'id', 'title', 'user_id', 'created_at', 'updated_at' ],
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    };
    if (user_id) {
      options.where = {
        user_id,
      };
    }
    return this.ctx.model.Activity.findAndCountAll(options);
  }

  async find(id) {
    const activity = await this.ctx.model.Activity.findByPk(id, {
      include: [{
        model: this.ctx.model.User,
        as: 'user',
        attributes: [ 'id', 'name', 'age' ],
      }],
    });
    if (!activity) {
      this.ctx.throw(404, 'activity not found');
    }
    return activity;
  }

  async create(activity) {
    return this.ctx.model.Activity.create(activity);
  }

  async update({ id, user_id, updates }) {
    const activity = await this.ctx.model.Activity.findByIdWithUser(id, user_id);
    if (!activity) this.ctx.throw(404, 'activity not found');
    return activity.update(updates);
  }

  async destroy({ id, user_id }) {
    const activity = await this.ctx.model.Activity.findByIdWithUser(id, user_id);
    if (!activity) this.ctx.throw(404, 'activity not found');
    return activity.destroy();
  }
}

module.exports = Activity;
