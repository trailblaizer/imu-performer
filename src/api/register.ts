import { Express } from 'express';
import { register as imuApi } from './imu';
import { register as transportApi } from './transport';

export function registerApis(app: Express) {
  imuApi(app);
  transportApi(app);
}
