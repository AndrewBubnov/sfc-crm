import { Router } from 'express';
import { renameDeviceController } from '../controllers/renameDeviceController.js';

const renameDeviceRoute = Router();

renameDeviceRoute.put('/:id/rename', renameDeviceController);

export { renameDeviceRoute };
