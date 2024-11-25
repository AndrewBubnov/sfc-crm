import { Device, DeviceMode, DeviceState, DeviceType } from './models/device.js';
import { faker } from '@faker-js/faker';

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

export const createDevices = (): Device[] => Array.from({ length: 93 }, createDevice);

export const sortDevices = (devices: Device[], sortBy?: keyof Device, sortDesc?: boolean): Device[] => {
	if (!sortBy) return devices;

	return [...devices].sort((a, b) => {
		const aVal = a[sortBy];
		const bVal = b[sortBy];

		if ((aVal || '') < (bVal || '')) return sortDesc ? 1 : -1;
		if ((aVal || '') > (bVal || '')) return sortDesc ? -1 : 1;
		return 0;
	});
};

export const getFilteredDevices = (devices: Device[], filterBy?: string, filter_field?: keyof Device): Device[] => {
	if (!filterBy || !filter_field) return devices;

	const lowerFilter = filterBy.toLowerCase();

	return devices.filter(device => device[filter_field].toLowerCase().includes(lowerFilter));
};

export const getStats = (filteredDevices: Device[], total: number) => {
	const reducedData = filteredDevices.reduce(
		(acc, cur) => {
			acc[cur.state] = (acc[cur.state] || 0) + 1;
			return acc;
		},
		{} as Record<DeviceState, number>
	);
	return { ...reducedData, total };
};
