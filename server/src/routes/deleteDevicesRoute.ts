import { Router } from 'express';
import { deleteDevicesController } from '../controllers/deleteDeviceController.js';

const deleteDevicesRoute = Router();

deleteDevicesRoute.post('/', deleteDevicesController);

export { deleteDevicesRoute };
