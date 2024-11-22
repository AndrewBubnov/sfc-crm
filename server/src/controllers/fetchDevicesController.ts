import { Request, Response } from 'express';
import { Device, QueryParams } from '../models/device.js';
import { filterDevices, sortDevices } from '../utils.js';
import { devices } from '../services/deviceService.js';

export const fetchDevicesController = (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
	let { offset = '0', limit = '10', sort_by, sort_desc, filter_by } = req.query;

	const parsedOffset = Math.max(0, parseInt(offset, 10));
	const parsedLimit = [10, 20].includes(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
	const parsedSortDesc = sort_desc === 'true';

	let result = filterDevices(devices, filter_by);

	result = sortDevices(result, sort_by, parsedSortDesc);

	const total = result.length;
	result = result.slice(
		Math.max(parsedOffset - parsedLimit, 0),
		Math.max(parsedOffset, Math.min(parsedLimit, result.length))
	);

	res.json({
		items: result,
		offset: parsedOffset,
		limit: parsedLimit,
		total,
	});
};
