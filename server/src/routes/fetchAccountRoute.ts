import { Router } from 'express';
import { fetchAccountController } from '../controllers/fetchAccountController.js';

const fetchAccountRoute = Router();

fetchAccountRoute.get('/', fetchAccountController);

export { fetchAccountRoute };
