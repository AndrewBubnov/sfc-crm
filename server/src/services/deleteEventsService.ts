import { getStateStats, getTypeStats } from '../utils.js';
import { devices, filterDevices } from './deviceService.js';
import { clients } from '../models/clients.js';

export const addDeviceDeleteEvent = (ids: string[]) => {
	const { filteredDevices, total } = filterDevices();
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
