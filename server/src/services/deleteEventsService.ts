import { getStateStats, getTypeStats } from '../utils.js';
import { devices, filteredDevices } from './deviceService.js';
import { clients } from '../models/clients.js';
import { AutoEventType } from '../models/autoEventType.js';

export const addDeviceDeleteEvent = () => {
	clients.forEach(client => {
		client.write(`event: ${AutoEventType.Deleted}\n`);
		client.write(
			`data: ${JSON.stringify({
				stats: { state: getStateStats(filteredDevices, devices.length), type: getTypeStats(filteredDevices) },
			})}\n\n`
		);
	});
};
