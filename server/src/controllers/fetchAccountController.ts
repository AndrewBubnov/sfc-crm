import { Request, Response } from 'express';

const FETCH_ACCOUNT_DELAY = 1200;

export const fetchAccountController = (_: Request, res: Response) => {
	setTimeout(
		() =>
			res.json({
				name: 'Andrew Bubnov',
				email: 'andrew.bubnov75@gmail.com',
				image: 'https://github.com/shadcn.png',
			}),
		FETCH_ACCOUNT_DELAY
	);
};
