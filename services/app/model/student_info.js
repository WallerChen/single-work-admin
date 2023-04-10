'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const StudentInfo = app.model.define('student_info', {

    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    created_at: DATE,
    updated_at: DATE,
    deleted: INTEGER,
    openid: STRING,
    name: STRING,
    id_card: STRING,
    province: STRING,
    city: STRING,
    country: STRING,
    birthday: STRING,
    sex: STRING,
    id_card_status: INTEGER,
    fail_tries: INTEGER,
    education_auth_status: INTEGER,
    education_images: STRING,
    school_bachelor: STRING,
    school_master: STRING,
    school_doctor: STRING,
    job_auth_status: INTEGER,
    job_images: STRING,
    job_company: STRING,
  }, {
    freezeTableName: true,
  });


  return StudentInfo;
};
