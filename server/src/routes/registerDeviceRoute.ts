import { Router } from 'express';
import { registerDeviceController } from '../controllers/registerDeviceController.js';

const registerDeviceRoute = Router();

registerDeviceRoute.post('/', registerDeviceController);

export { registerDeviceRoute };
