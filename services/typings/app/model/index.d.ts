// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportActivity = require('../../../app/model/activity');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Activity: ReturnType<typeof ExportActivity>;
    User: ReturnType<typeof ExportUser>;
  }
}
