import { Request, Response } from 'express';
import { QueryParams } from '../models/device.js';
import { getStateStats, getTypeStats, sleep, sortDevices } from '../utils.js';
import { devices, filterDevices, filteredDevices } from '../services/deviceService.js';
import { clients } from '../models/clients.js';

const FETCH_DEVICES_DELAY = 600;

let isConnected = false;

export const fetchDevicesController = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
	let { offset = '0', limit = '10', sort_by, sort_desc, filter_by, filter_field } = req.query;

	const parsedOffset = Math.max(0, parseInt(offset, 10));
	const parsedLimit = [10, 20].includes(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
	const parsedSortDesc = sort_desc === 'true';

	filterDevices(filter_by, filter_field);

	let result = sortDevices(filteredDevices, sort_by, parsedSortDesc);

	const total = result.length;
	result = result.slice(
		Math.max(parsedOffset - parsedLimit, 0),
		Math.max(parsedOffset, Math.min(parsedLimit, result.length))
	);

	await sleep(FETCH_DEVICES_DELAY);

	res.json({
		items: result,
		offset: parsedOffset,
		limit: parsedLimit,
		total,
	});

	if (!isConnected) {
		isConnected = true;
		clients.forEach(client => {
			client.write(`event: connected\n`);
			client.write(
				`data: ${JSON.stringify({
					stats: {
						state: getStateStats(filteredDevices, devices.length),
						type: getTypeStats(filteredDevices),
					},
				})}\n\n`
			);
		});
	}
};
