import { Request, Response } from 'express';
import { devices, filterDevices, updateDevices } from '../services/deviceService.js';
import { clearInterval } from 'node:timers';
import { Device } from '../models/device.js';
import { AUTO_EVENTS_INTERVAL } from '../constants.js';
import { AutoEventType } from '../models/autoEventType.js';
import { clients } from '../models/clients.js';
import { createDevice, getStateStats, getTypeStats, sortDevices } from '../utils.js';
import { offsetLimits } from '../services/filterService.js';

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
	res.write(
		`data: ${JSON.stringify({
			stats: {
				state: getStateStats(filterDevices(), devices.length),
				type: getTypeStats(filterDevices()),
			},
		})}\n\n`
	);

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
		const sentDevices = sortDevices(filterDevices());
		res.write(`event: ${event.type}\n`);
		res.write(
			`data: ${JSON.stringify({
				event: event.payload,
				stats: {
					state: getStateStats(sentDevices, devices.length),
					type: getTypeStats(sentDevices),
				},
				items: sentDevices.slice(
					Math.max(offsetLimits.offset - offsetLimits.limit, 0),
					Math.max(offsetLimits.offset, Math.min(offsetLimits.limit, sentDevices.length))
				),
			})}\n\n`
		);
	};

	const intervalId = setInterval(sendEvent, AUTO_EVENTS_INTERVAL);

	req.on('close', () => {
		clearInterval(intervalId);
		const index = clients.indexOf(res);
		if (index !== -1) clients.splice(index, 1);
	});
};
