export enum DeviceType {
	Type1 = 'type1',
	Type2 = 'type2',
	Type3 = 'type3',
	Type4 = 'type4',
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
	state: DeviceState;
};

export type RenameDeviceParams = {
	id: string;
};

export type RenameDeviceBody = {
	name: string;
};

export type RegisterDeviceBody = {
	type: DeviceType;
	state: DeviceMode;
	name?: string;
};

export type QueryParams = {
	offset?: string;
	limit?: string;
	sort_by?: keyof Device;
	sort_desc?: string;
	filter_by?: string | string[];
	filter_field?: string | string[];
};
