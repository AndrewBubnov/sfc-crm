import { Response } from 'express';
import { Device } from '../models/device.js';
import { getStats } from '../utils.js';
import { devices, filteredDevices } from './deviceService.js';

export const clients: Array<Response> = [];

export const addDeviceUpdateEvent = (event: Device) => {
	clients.forEach(client => {
		client.write(`event: deviceUpdate\n`);
		client.write(`data: ${JSON.stringify({ event, stats: getStats(filteredDevices, devices.length) })}\n\n`);
	});
};
