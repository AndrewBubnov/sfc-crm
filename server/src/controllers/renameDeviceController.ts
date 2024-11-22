import { Request, Response } from 'express';
import { RenameDeviceBody, RenameDeviceParams } from '../models/device.js';
import { devices } from '../services/deviceService.js';

export const renameDeviceController = (req: Request<RenameDeviceParams, {}, RenameDeviceBody>, res: Response) => {
	const { id } = req.params;
	const { name } = req.body as { name: string };

	if (!name) {
		return res.status(400).json({ error: 'Name is required' });
	}

	const deviceIndex = devices.findIndex(device => device.id === id);

	if (deviceIndex === -1) {
		return res.status(404).json({ error: 'Device not found' });
	}

	devices[deviceIndex].name = name;

	res.json(devices[deviceIndex]);
};
