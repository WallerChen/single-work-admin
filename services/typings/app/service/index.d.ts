// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportActivity = require('../../../app/service/activity');
import ExportUser = require('../../../app/service/user');

declare module 'egg' {
  interface IService {
    activity: AutoInstanceType<typeof ExportActivity>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
