import { Request, Response } from 'express';
import { DeleteDeviceBody } from '../models/device.js';
import { devices, updateDevices, updateFilteredDevices } from '../services/deviceService.js';
import { addDeviceDeleteEvent } from '../services/deleteEventsService.js';

const DELETE_DEVICES_DELAY = 1_000;

export const deleteDevicesController = (req: Request<{}, {}, DeleteDeviceBody>, res: Response) => {
	const { ids } = req.body;

	const updatedDevices = devices.filter(device => !ids.includes(device.id));

	updateDevices(updatedDevices);
	updateFilteredDevices(updatedDevices);
	addDeviceDeleteEvent();

	setTimeout(() => res.status(200).send(ids), DELETE_DEVICES_DELAY);
};
