import { getFilteredDevices } from '../utils.js';
import { describe, it, expect } from 'vitest';
import { Device, DeviceMode, DeviceType } from '../models/device.js';

describe('getFilteredDevices', () => {
	const devices: Device[] = [
		{ id: '1', type: DeviceType.Type1, name: 'DeviceA', state: DeviceMode.Off },
		{ id: '2', type: DeviceType.Type2, name: 'DeviceB', state: DeviceMode.Standby },
		{ id: '3', type: DeviceType.Type3, name: 'DeviceC', state: DeviceMode.Charging },
		{ id: '4', type: DeviceType.Type1, name: 'DeviceD', state: 'error' },
	];

	it('should return all devices if `filter_by` and `filter_field` are not provided', () => {
		const result = getFilteredDevices(devices);
		expect(result).toEqual(devices);
	});

	it('should filter devices by a single field and value', () => {
		const result = getFilteredDevices(devices, 'type1', 'type');
		expect(result).toEqual([
			{ id: '1', type: DeviceType.Type1, name: 'DeviceA', state: DeviceMode.Off },
			{ id: '4', type: DeviceType.Type1, name: 'DeviceD', state: 'error' },
		]);
	});

	it('should filter devices by multiple fields and values', () => {
		const result = getFilteredDevices(devices, ['type1', 'DeviceD'], ['type', 'name']);
		expect(result).toEqual([{ id: '4', type: DeviceType.Type1, name: 'DeviceD', state: 'error' }]);
	});

	it('should return all devices if filter_field is empty', () => {
		const result = getFilteredDevices(devices, 'type1', []);
		expect(result).toEqual(devices);
	});

	it('should return all devices if `filter_by` is empty', () => {
		const result = getFilteredDevices(devices, '', 'type');
		expect(result).toEqual(devices);
	});

	it('should filter case insensitive', () => {
		const result = getFilteredDevices(devices, 'devicea', 'name');
		expect(result).toEqual([{ id: '1', type: DeviceType.Type1, name: 'DeviceA', state: DeviceMode.Off }]);
	});

	it('should handle undefined `filter_field` and `filter_by` gracefully', () => {
		const result = getFilteredDevices(devices, undefined, undefined);
		expect(result).toEqual(devices);
	});
});
