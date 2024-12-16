import axios from 'axios';
import { DeviceMode, DeviceType } from '@/types.ts';
import { BASE_URL } from '@/modules/shared/constants.ts';

type RegisterDevice = {
	type: DeviceType;
	state: DeviceMode;
	name?: string;
};

export const registerDevice = async (body: RegisterDevice) => {
	return axios.post(`${BASE_URL}/devices/register`, body);
};
