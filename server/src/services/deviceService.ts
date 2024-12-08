import { createDevices, getFilteredDevices } from '../utils.js';
import { Device } from '../models/device.js';
import { filters, offsetLimits } from './filterService.js';

export let devices = createDevices();

export const filterDevices = () => {
	const filtered = getFilteredDevices(devices, filters.filterBy, filters.filterField as Array<keyof Device>);
	return {
		filteredDevices: filtered.slice(
			Math.max(offsetLimits.offset - offsetLimits.limit, 0),
			Math.max(offsetLimits.offset, Math.min(offsetLimits.limit, filtered.length))
		),
		total: filtered.length,
	};
};

export const updateDevices = (updatedDevices: Device[]) => {
	devices = updatedDevices;
};
