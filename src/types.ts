export enum DeviceType {
	EfoyPro800 = 'efoy_pro_800',
	Efoy80 = 'efoy_80',
}

export enum DeviceMode {
	Off = 'off',
	Standby = 'standby',
	Charging = 'charging',
}

export type DeviceState = DeviceMode | 'error';

export type Device = {
	id: string;
	type: DeviceType;
	name: string;
	state: DeviceState | null;
	mode: DeviceMode;
};

export type Account = {
	name: 'string';
	email: 'string';
	image: 'string';
};

export type DeviceDataResponse = {
	data: {
		items: Device[];
		total: number;
	};
};

export type AccountDataResponse = {
	data: Account;
};
