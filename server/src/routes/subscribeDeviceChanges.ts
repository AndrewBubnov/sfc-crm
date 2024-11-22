import { Router } from 'express';
import { subscribeDeviceChangesController } from '../controllers/subscribeDeviceChangesController.js';

const subscribeDeviceChanges = Router();

subscribeDeviceChanges.get('/', subscribeDeviceChangesController);

export { subscribeDeviceChanges };
