import { Router } from 'express';
import { subscribeDeviceChangesController } from '../controllers/subscribeDeviceChangesController.js';

const subscribeDeviceChangesRoute = Router();

subscribeDeviceChangesRoute.get('/', subscribeDeviceChangesController);

export { subscribeDeviceChangesRoute };
