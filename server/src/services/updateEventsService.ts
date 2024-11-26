import { Response } from 'express';
import { Device } from '../models/device.js';
import { getStateStats, getTypeStats } from '../utils.js';
import { devices, filteredDevices } from './deviceService.js';

export const clients: Array<Response> = [];

export const addDeviceUpdateEvent = (event: Device) => {
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
