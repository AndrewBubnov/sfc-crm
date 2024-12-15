import { Request, Response } from 'express';
import { QueryParams } from '../models/device.js';
import { getStateStats, getTypeStats, sleep, sortDevices } from '../utils.js';
import { devices, filterDevices } from '../services/deviceService.js';
import { clients } from '../models/clients.js';
import { offsetLimits, updateFilters, updateOffsetLimits, updateSort } from '../services/filterService.js';

const FETCH_DEVICES_DELAY = 600;
const LIMIT_VARIANTS = [10, 20];

export const fetchDevicesController = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
	let { offset = '0', limit = '10', sort_by, sort_desc, filter_by, filter_field } = req.query;

	const parsedOffset = Math.max(0, parseInt(offset, 10));
	const parsedLimit = LIMIT_VARIANTS.includes(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
	const parsedSortDesc = sort_desc === 'true';

	updateFilters({
		filterBy: filter_by,
		filterField: filter_field,
	});

	updateSort({
		sortBy: sort_by,
		sortDesc: parsedSortDesc,
	});

	updateOffsetLimits({
		offset: parsedOffset,
		limit: parsedLimit,
	});

	const filteredDevices = filterDevices();

	await sleep(FETCH_DEVICES_DELAY);

	res.json({
		items: sortDevices(filteredDevices).slice(
			Math.max(offsetLimits.offset - offsetLimits.limit, 0),
			Math.max(offsetLimits.offset, Math.min(offsetLimits.limit, filteredDevices.length))
		),
		offset: parsedOffset,
		limit: parsedLimit,
		total: filteredDevices.length,
	});

	clients.forEach(client => {
		client.write(`event: updateStats\n`);
		client.write(
			`data: ${JSON.stringify({
				stats: {
					state: getStateStats(filteredDevices, devices.length),
					type: getTypeStats(filteredDevices),
				},
			})}\n\n`
		);
	});
};
