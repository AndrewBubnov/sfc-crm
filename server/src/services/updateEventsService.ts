import { Device } from '../models/device.js';
import { getStateStats, getTypeStats } from '../utils.js';
import { devices, filterDevices } from './deviceService.js';
import { clients } from '../models/clients.js';

export const addDeviceUpdateEvent = (event: Device) => {
	const filteredDevices = filterDevices();
	clients.forEach(client => {
		client.write(`event: deviceUpdate\n`);
		client.write(
			`data: ${JSON.stringify({
				event,
				stats: { state: getStateStats(filteredDevices, devices.length), type: getTypeStats(filteredDevices) },
			})}\n\n`
		);
	});
};
