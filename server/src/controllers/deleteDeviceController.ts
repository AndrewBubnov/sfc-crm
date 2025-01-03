import { Request, Response } from 'express';
import { DeleteDeviceBody } from '../models/device.js';
import { devices, updateDevices } from '../services/deviceService.js';
import { addDeviceDeleteEvent } from '../services/deleteEventsService.js';
import { sleep } from '../utils.js';

const DELETE_DEVICES_DELAY = 2_000;

export const deleteDevicesController = async (req: Request<{}, {}, DeleteDeviceBody>, res: Response) => {
	const { ids } = req.body;

	const updatedDevices = devices.filter(device => !ids.includes(device.id));

	updateDevices(updatedDevices);

	await sleep(DELETE_DEVICES_DELAY);

	res.status(200).send(ids);
	addDeviceDeleteEvent(ids);
};
