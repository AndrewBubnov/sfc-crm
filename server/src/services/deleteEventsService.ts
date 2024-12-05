import { getStateStats, getTypeStats } from '../utils.js';
import { devices, filteredDevices } from './deviceService.js';
import { clients } from '../models/clients.js';

export const addDeviceDeleteEvent = (ids: string[]) => {
	clients.forEach(client => {
		client.write(`event: multipleDevicesDeleted\n`);
		client.write(
			`data: ${JSON.stringify({
				event: ids,
				stats: { state: getStateStats(filteredDevices, devices.length), type: getTypeStats(filteredDevices) },
			})}\n\n`
		);
	});
};
