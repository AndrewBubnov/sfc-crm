import { getStateStats, getTypeStats } from '../utils.js';
import { devices, filterDevices } from './deviceService.js';
import { clients } from '../models/clients.js';
import { offsetLimits } from './filterService.js';

export const addDeviceDeleteEvent = (ids: string[]) => {
	const filteredDevices = filterDevices();
	clients.forEach(client => {
		client.write(`event: multipleDevicesDeleted\n`);
		client.write(
			`data: ${JSON.stringify({
				event: ids,
				stats: { state: getStateStats(filteredDevices, devices.length), type: getTypeStats(filteredDevices) },
				items: filteredDevices.slice(
					Math.max(offsetLimits.offset - offsetLimits.limit, 0),
					Math.max(offsetLimits.offset, Math.min(offsetLimits.limit, filteredDevices.length))
				),
			})}\n\n`
		);
	});
};
