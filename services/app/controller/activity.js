// app/controller/activity.js
const { Controller } = require('egg');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class ActivityController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = {
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    };
    console.log('query:' + JSON.stringify(query));
    ctx.body = await ctx.model.Activity.findAndCountAll(query);
  }

  async create() {
    const ctx = this.ctx;
    const { title, price, content, organizer, images } = ctx.request.body;
    const activity = await ctx.model.Activity.create({ title, price, content, organizer, images });
    ctx.status = 201;
    ctx.body = activity;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const activity = await ctx.model.Activity.findByPk(id);
    if (!activity) {
      ctx.status = 404;
      return;
    }

    const { title, price, content, organizer, images } = ctx.request.body;
    await activity.update({ title, price, content, organizer, images });
    ctx.body = activity;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.Activity.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }
}

module.exports = ActivityController;
