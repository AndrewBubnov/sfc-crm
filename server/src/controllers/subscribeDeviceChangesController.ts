import { clients } from '../services/updateEventsService.js';
import { createDevice } from '../utils.js';
import { devices } from '../services/deviceService.js';
import { clearInterval } from 'node:timers';
import { Request, Response } from 'express';

export const subscribeDeviceChangesController = (req: Request, res: Response) => {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
	});

	res.write(`event: connected\n`);
	res.write(`data: {"message": "Subscribed successfully"}\n\n`);

	clients.push(res);

	const sendEvent = () => {
		const events = [
			{
				type: 'deviceCreated',
				payload: { device: createDevice() },
			},
			{
				type: 'deviceDeleted',
				payload: {
					deviceId: devices.length ? devices[Math.floor(Math.random() * devices.length)].id : null,
				},
			},
		];

		const event = events[Math.floor(Math.random() * events.length)];

		res.write(`event: ${event.type}\n`);
		res.write(`data: ${JSON.stringify(event.payload)}\n\n`);
	};

	const intervalId = setInterval(sendEvent, 10000);

	req.on('close', () => {
		clearInterval(intervalId);
		const index = clients.indexOf(res);
		if (index !== -1) clients.splice(index, 1);
	});
};
