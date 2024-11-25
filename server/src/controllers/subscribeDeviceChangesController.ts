import { clients } from '../services/updateEventsService.js';
import { createDevice, getStats } from '../utils.js';
import { devices, filteredDevices, updateDevices } from '../services/deviceService.js';
import { clearInterval } from 'node:timers';
import { Request, Response } from 'express';
import { Device } from '../models/device.js';
import { AUTO_EVENTS_INTERVAL } from '../constants.js';

enum AutoEventType {
	Created = 'deviceCreated',
	Deleted = 'deviceDeleted',
}

type AutoEvent =
	| { type: AutoEventType.Created; payload: { device: Device; id?: undefined } }
	| { type: AutoEventType.Deleted; payload: { id: string | null; device?: undefined } };

export const subscribeDeviceChangesController = (req: Request, res: Response) => {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
	});

	res.write(`event: connected\n`);
	res.write(`data: ${JSON.stringify({ stats: getStats(filteredDevices, devices.length) })}\n\n`);

	clients.push(res);

	const updateDevicesList = (event: AutoEvent) => {
		if (event.type === AutoEventType.Created) {
			devices.push(event.payload.device as Device);
		}
		if (event.type === AutoEventType.Deleted) {
			updateDevices(devices.filter(device => device.id !== event.payload.id));
		}
	};

	const sendEvent = () => {
		const events: AutoEvent[] = [
			{
				type: AutoEventType.Created,
				payload: { device: createDevice() },
			},
			{
				type: AutoEventType.Deleted,
				payload: {
					id: devices.length ? devices[Math.floor(Math.random() * devices.length)].id : null,
				},
			},
		];

		const event = events[Math.floor(Math.random() * events.length)];

		updateDevicesList(event);

		res.write(`event: ${event.type}\n`);
		res.write(
			`data: ${JSON.stringify({ event: event.payload, stats: getStats(filteredDevices, devices.length) })}\n\n`
		);
	};

	const intervalId = setInterval(sendEvent, AUTO_EVENTS_INTERVAL);

	req.on('close', () => {
		clearInterval(intervalId);
		const index = clients.indexOf(res);
		if (index !== -1) clients.splice(index, 1);
	});
};
