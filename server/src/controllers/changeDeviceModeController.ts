import { Request, Response } from 'express';
import { DeviceMode } from '../models/device.js';
import { devices } from '../services/deviceService.js';
import { addDeviceUpdateEvent } from '../services/updateEventsService.js';

const UPDATE_MODE_DELAY = 2_000;

export const changeDeviceModeController = (req: Request, res: Response) => {
	const { id } = req.params;
	const { mode } = req.body as { mode: DeviceMode };

	if (!mode || !Object.values(DeviceMode).includes(mode)) {
		return res.status(400).json({ error: 'Invalid mode' });
	}

	const deviceIndex = devices.findIndex(device => device.id === id);

	if (deviceIndex === -1) {
		return res.status(404).json({ error: 'Device not found' });
	}

	setTimeout(() => {
		devices[deviceIndex].state = devices[deviceIndex].state === 'error' ? 'error' : mode;
		res.status(200).send(devices[deviceIndex]);

		addDeviceUpdateEvent({
			id,
			mode,
			state: devices[deviceIndex].state,
			type: devices[deviceIndex].type,
		});
	}, UPDATE_MODE_DELAY);
};
