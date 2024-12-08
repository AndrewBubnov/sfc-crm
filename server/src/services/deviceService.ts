import { createDevices, getFilteredDevices } from '../utils.js';
import { Device } from '../models/device.js';
import { filters } from './filterService.js';

export let devices = createDevices();

export const filterDevices = () => {
	const filteredDevices = getFilteredDevices(devices, filters.filterBy, filters.filterField as Array<keyof Device>);
	return {
		filteredDevices,
		total: filteredDevices.length,
	};
};

export const updateDevices = (updatedDevices: Device[]) => {
	devices = updatedDevices;
};
