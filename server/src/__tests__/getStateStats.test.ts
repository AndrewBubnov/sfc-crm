import { describe, it, expect } from 'vitest';
import { Device, DeviceMode, DeviceState, DeviceType } from '../models/device.js';
import { getStateStats } from '../utils.js';

describe('getStateStats', () => {
	const devices: Device[] = [
		{ id: '1', type: DeviceType.Type1, name: 'Device A', state: DeviceMode.Off },
		{ id: '2', type: DeviceType.Type2, name: 'Device B', state: DeviceMode.Charging },
		{ id: '3', type: DeviceType.Type3, name: 'Device C', state: DeviceMode.Off },
		{ id: '4', type: DeviceType.Type4, name: 'Device D', state: DeviceMode.Standby },
		{ id: '5', type: DeviceType.Type1, name: 'Device E', state: 'error' as DeviceState },
	];

	it('should return the correct stats for multiple device states', () => {
		const stats = getStateStats(devices, devices.length);
		expect(stats).toEqual({
			off: 2,
			charging: 1,
			standby: 1,
			error: 1,
			total: 5,
		});
	});

	it('should handle empty device array', () => {
		const stats = getStateStats([], 0);
		expect(stats).toEqual({
			total: 0,
		});
	});

	it('should return correct stats when all devices are in the same state', () => {
		const sameStateDevices: Device[] = [
			{ id: '1', type: DeviceType.Type1, name: 'Device A', state: DeviceMode.Off },
			{ id: '2', type: DeviceType.Type2, name: 'Device B', state: DeviceMode.Off },
			{ id: '3', type: DeviceType.Type3, name: 'Device C', state: DeviceMode.Off },
		];
		const stats = getStateStats(sameStateDevices, sameStateDevices.length);
		expect(stats).toEqual({
			off: 3,
			total: 3,
		});
	});

	it('should handle the case where no devices are provided and total is non-zero', () => {
		const stats = getStateStats([], 5);
		expect(stats).toEqual({
			total: 5,
		});
	});
});
