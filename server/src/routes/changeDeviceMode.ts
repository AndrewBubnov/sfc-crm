import { Router } from 'express';
import { changeDeviceModeController } from '../controllers/changeDeviceModeController.js';

const changeDeviceModeRoute = Router();

changeDeviceModeRoute.put('/:id/change_mode', changeDeviceModeController);

export { changeDeviceModeRoute };
