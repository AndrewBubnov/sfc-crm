import { Router } from 'express';
import { fetchDevicesController } from '../controllers/fetchDevicesController.js';

const fetchDevicesRoute = Router();

fetchDevicesRoute.get('/', fetchDevicesController);

export { fetchDevicesRoute };
