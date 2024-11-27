import { createDevices, getFilteredDevices } from '../utils.js';
import { Device } from '../models/device.js';

export let devices = createDevices();
export let filteredDevices = devices;

export const filterDevices = (filter_by?: string | string[], filter_field?: string | string[]) => {
	filteredDevices = getFilteredDevices(devices, filter_by, filter_field as Array<keyof Device>);
};

export const updateDevices = (updatedDevices: Device[]) => {
	devices = updatedDevices;
};
