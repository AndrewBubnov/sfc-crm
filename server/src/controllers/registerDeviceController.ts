import { Request, Response } from 'express';
import { Device, RegisterDeviceBody } from '../models/device.js';
import { devices } from '../services/deviceService.js';
import { faker } from '@faker-js/faker';

export const registerDeviceController = (req: Request<{}, {}, RegisterDeviceBody>, res: Response) => {
	const { name, type, state } = req.body;

	const device: Device = {
		id: faker.string.uuid().slice(0, 16),
		name: name ? name : faker.word.verb({ length: { min: 5, max: 10 }, strategy: 'longest' }),
		type,
		state,
	};

	devices.unshift(device);

	res.json(devices);
};
