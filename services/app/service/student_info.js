'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

const UNCHECKED = 0;
const PASS = 1;
const REJECT = 2;

class StudentInfo extends Service {

  //
  async getStudentInfo({ offset = 0, limit = 10, status = null }) {

    offset = Number(offset);
    limit = Number(limit);

    let whereClause = {};
    if (status !== null && status !== '') {
      status = Number(status);
      const statusList = [
        { id_card_status: status },
        { education_auth_status: status },
        { job_auth_status: status },
      ];
      if (status === REJECT || status === UNCHECKED) {
        whereClause = {
          [Op.or]: statusList,
        };
      } else if (status === PASS) {
        whereClause = {
          [Op.and]: statusList,
        };
      }
    }

    console.log('whereClause', whereClause);
    return this.ctx.model.StudentInfo.findAndCountAll({
      offset,
      limit,
      where: whereClause,
      order: [[ 'id_card_status', 'desc' ], [ 'created_at', 'desc' ], [ 'id', 'desc' ]],
    });
  }

  // 审核用户
  async verify({ studentId, type, status }) {

    console.log('studentId, type, status', studentId, type, status);
    const verifyStatus = {};
    if (type === 'job') {
      verifyStatus.job_auth_status = status;
    } else if (type === 'education') {
      verifyStatus.education_auth_status = status;
    }

    return this.ctx.model.StudentInfo.update(
      verifyStatus,
      {
        where: {
          id: studentId,
        },
      }
    );
  }
}

module.exports = StudentInfo;
