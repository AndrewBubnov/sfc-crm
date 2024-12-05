import { describe, it, expect } from 'vitest';
import { Device, DeviceState, DeviceType } from '../models/device.js';
import { getTypeStats } from '../utils.js';

describe('getTypeStats', () => {
	const devices: Device[] = [
		{ id: '1', type: DeviceType.Type1, name: 'Device A', state: 'off' as DeviceState },
		{ id: '2', type: DeviceType.Type2, name: 'Device B', state: 'charging' as DeviceState },
		{ id: '3', type: DeviceType.Type1, name: 'Device C', state: 'off' as DeviceState },
		{ id: '4', type: DeviceType.Type3, name: 'Device D', state: 'standby' as DeviceState },
		{ id: '5', type: DeviceType.Type2, name: 'Device E', state: 'error' as DeviceState },
	];

	it('should return the correct stats for multiple device types', () => {
		const stats = getTypeStats(devices);
		expect(stats).toEqual({
			type1: 2,
			type2: 2,
			type3: 1,
		});
	});

	it('should handle empty device array', () => {
		const stats = getTypeStats([]);
		expect(stats).toEqual({});
	});

	it('should return correct stats when all devices are of the same type', () => {
		const sameTypeDevices: Device[] = [
			{ id: '1', type: DeviceType.Type1, name: 'Device A', state: 'off' as DeviceState },
			{ id: '2', type: DeviceType.Type1, name: 'Device B', state: 'charging' as DeviceState },
			{ id: '3', type: DeviceType.Type1, name: 'Device C', state: 'off' as DeviceState },
		];
		const stats = getTypeStats(sameTypeDevices);
		expect(stats).toEqual({
			type1: 3,
		});
	});

	it('should return correct stats for devices with no types', () => {
		const stats = getTypeStats([]);
		expect(stats).toEqual({});
	});
});
