import { Device, DeviceMode, DeviceState, DeviceType } from './models/device.js';
import { faker } from '@faker-js/faker';
import { sort } from './services/filterService.js';

const INITIAL_DEVICES_NUMBER = 91;

export const getRandomNumber = () => {
	const random = Math.floor(Math.random() * 10);
	if (random <= 2) return 1;
	if (random <= 5) return 2;
	if (random <= 8) return 3;
	return 4;
};

export const createDevice = (): Device => {
	const randomState = getRandomNumber();
	let state: DeviceState = 'error';
	if (randomState === 1) state = DeviceMode.Off;
	if (randomState === 2) state = DeviceMode.Charging;
	if (randomState === 3) state = DeviceMode.Standby;
	const randomType = getRandomNumber();
	let type: DeviceType = DeviceType.Type1;
	if (randomType === 1) type = DeviceType.Type2;
	if (randomType === 2) type = DeviceType.Type3;
	if (randomType === 3) type = DeviceType.Type4;
	return {
		id: faker.string.uuid().slice(0, 16),
		name: faker.word.verb({ length: { min: 5, max: 10 }, strategy: 'longest' }),
		type,
		state,
	};
};

export const createDevices = (): Device[] => Array.from({ length: INITIAL_DEVICES_NUMBER }, createDevice);

export const sortDevices = (devices: Device[]): Device[] => {
	const { sortBy, sortDesc } = sort;

	if (!sortBy) return devices;

	return [...devices].sort((a, b) => {
		const aVal = a[sortBy as keyof Device];
		const bVal = b[sortBy as keyof Device];

		if ((aVal || '') < (bVal || '')) return sortDesc ? 1 : -1;
		if ((aVal || '') > (bVal || '')) return sortDesc ? -1 : 1;
		return 0;
	});
};

export const getFilteredDevices = (
	devices: Device[],
	filter_by?: string | string[],
	filter_field?: string | Array<keyof Device>
): Device[] => {
	if (!filter_by?.length || !filter_field?.length) return devices;
	const filterBy = Array.isArray(filter_by) ? filter_by : [filter_by];
	const filterField = (Array.isArray(filter_field) ? filter_field : [filter_field]) as Array<keyof Device>;
	return filterField.reduce((acc, cur, index) => {
		acc = acc.filter(el => el[cur].toLowerCase().includes(filterBy[index].toLowerCase()));
		return acc;
	}, devices);
};

export const getStateStats = (filteredDevices: Device[], total: number) => {
	const reducedData = filteredDevices.reduce(
		(acc, cur) => {
			acc[cur.state] = (acc[cur.state] || 0) + 1;
			return acc;
		},
		{} as Record<DeviceState, number>
	);
	return { ...reducedData, total, filteredTotal: filteredDevices.length };
};

export const getTypeStats = (filteredDevices: Device[]) => {
	return filteredDevices.reduce(
		(acc, cur) => {
			acc[cur.type] = (acc[cur.type] || 0) + 1;
			return acc;
		},
		{} as Record<DeviceType, number>
	);
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
