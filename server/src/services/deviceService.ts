import { createDevices } from '../utils.js';
import { Device } from '../models/device.js';

export let devices = createDevices();

export const updateDevices = (updatedDevices: Device[]) => {
	devices = updatedDevices;
};
