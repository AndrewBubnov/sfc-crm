import { Request, Response } from 'express';

export const fetchAccountController = (_: Request, res: Response) => {
	res.json({
		name: 'Andrew Bubnov',
		email: 'andrew.bubnov75@gmail.com',
		image: 'https://github.com/shadcn.png',
	});
};
