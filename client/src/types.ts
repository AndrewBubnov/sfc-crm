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
	state: DeviceState | null;
	mode: DeviceMode;
};

export type Account = {
	name: 'string';
	email: 'string';
	image: 'string';
};

export type DeviceDataType = {
	data: {
		items: Device[];
		total: number;
	};
};

export type AccountDataType = {
	data: Account;
};

export type GraphData = {
	name: string;
	value: number;
	fill: string;
};

export enum QueryParam {
	Page = 'page',
	Limit = 'limit',
	SortBy = 'sortBy',
	SortDesc = 'sortDesc',
	Field = 'field',
	Search = 'search',
}

export type FilterField = 'id' | 'name' | 'type' | 'state';

export type Filter = { [QueryParam.Search]: string; [QueryParam.Field]: FilterField };

export type Sort = { [QueryParam.SortBy]: string; [QueryParam.SortDesc]: boolean };

export type QueryData<T = Device> = Record<'data', { items: T[]; total: number }>;
