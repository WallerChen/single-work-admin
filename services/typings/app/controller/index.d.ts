// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportActivity = require('../../../app/controller/activity');
import ExportCron = require('../../../app/controller/cron');
import ExportHome = require('../../../app/controller/home');
import ExportStudentInfo = require('../../../app/controller/student_info');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    activity: ExportActivity;
    cron: ExportCron;
    home: ExportHome;
    studentInfo: ExportStudentInfo;
    user: ExportUser;
  }
}
