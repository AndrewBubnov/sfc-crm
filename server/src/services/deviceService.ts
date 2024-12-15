import { createDevices, getFilteredDevices } from '../utils.js';
import { Device } from '../models/device.js';
import { filters } from './filterService.js';

export let devices = createDevices();

export const filterDevices = () =>
	getFilteredDevices(devices, filters.filterBy, filters.filterField as Array<keyof Device>);

export const updateDevices = (updatedDevices: Device[]) => {
	devices = updatedDevices;
};
