import { Request, Response } from 'express';
import { Device, RegisterDeviceBody } from '../models/device.js';
import { devices, filterDevices } from '../services/deviceService.js';
import { faker } from '@faker-js/faker';
import { clients } from '../models/clients.js';
import { getStateStats, getTypeStats } from '../utils.js';

export const registerDeviceController = (req: Request<{}, {}, RegisterDeviceBody>, res: Response) => {
	const { name, type, state } = req.body;

	const device: Device = {
		id: faker.string.uuid().slice(0, 16),
		name: name ? name : faker.word.verb({ length: { min: 5, max: 10 }, strategy: 'longest' }),
		type,
		state,
	};

	devices.unshift(device);

	const { filteredDevices, total } = filterDevices();

	clients.forEach(client => {
		client.write(`event: registerDevice\n`);
		client.write(
			`data: ${JSON.stringify({
				event: device,
				stats: { state: getStateStats(filteredDevices, devices.length), type: getTypeStats(filteredDevices) },
			})}\n\n`
		);
	});

	res.json(device);
};
