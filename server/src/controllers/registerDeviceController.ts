import { Request, Response } from 'express';
import { Device, RegisterDeviceBody } from '../models/device.js';
import { devices, filterDevices } from '../services/deviceService.js';
import { faker } from '@faker-js/faker';
import { clients } from '../models/clients.js';
import { getStateStats, getTypeStats, sleep } from '../utils.js';
import { offsetLimits } from '../services/filterService.js';

const REGISTER_DEVICES_DELAY = 1_000;

export const registerDeviceController = async (req: Request<{}, {}, RegisterDeviceBody>, res: Response) => {
	const { name, type, state } = req.body;

	const device: Device = {
		id: faker.string.uuid().slice(0, 16),
		name: name ? name : faker.word.verb({ length: { min: 5, max: 10 }, strategy: 'longest' }),
		type,
		state,
	};

	await sleep(REGISTER_DEVICES_DELAY);

	devices.unshift(device);

	const filteredDevices = filterDevices();

	res.json(device);

	clients.forEach(client => {
		client.write(`event: registerDevice\n`);
		client.write(
			`data: ${JSON.stringify({
				event: device,
				stats: { state: getStateStats(filteredDevices, devices.length), type: getTypeStats(filteredDevices) },
				items: filterDevices().slice(
					Math.max(offsetLimits.offset - offsetLimits.limit, 0),
					Math.max(offsetLimits.offset, Math.min(offsetLimits.limit, filterDevices().length))
				),
			})}\n\n`
		);
	});
};
