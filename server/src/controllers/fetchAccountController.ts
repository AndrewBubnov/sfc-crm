import { Request, Response } from 'express';
import { sleep } from '../utils.js';

const FETCH_ACCOUNT_DELAY = 1200;

export const fetchAccountController = async (_: Request, res: Response) => {
	await sleep(FETCH_ACCOUNT_DELAY);
	res.json({
		name: 'Andrew Bubnov',
		email: 'andrew.bubnov75@gmail.com',
		image: 'https://github.com/shadcn.png',
	});
};
