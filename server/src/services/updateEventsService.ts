import { Response } from 'express';
import { DeviceMode, DeviceType } from '../models/device.js';

export const clients: Array<Response> = [];

export const addDeviceUpdateEvent = (event: {
	id: string;
	mode: DeviceMode;
	state: string | null;
	type: DeviceType;
}) => {
	clients.forEach(client => {
		client.write(`event: deviceUpdate\n`);
		client.write(`data: ${JSON.stringify(event)}\n\n`);
	});
};
