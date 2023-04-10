// app/controller/users.js
const Controller = require('egg').Controller;


class StudentInfoController extends Controller {

  async getList() {
    const ctx = this.ctx;
    console.log('getList query', ctx.query);
    ctx.body = await ctx.service.studentInfo.getStudentInfo(ctx.query);
  }

  async verify() {
    const ctx = this.ctx;

    ctx.body = await ctx.service.studentInfo.verify(ctx.request.body);
  }

}

module.exports = StudentInfoController;
