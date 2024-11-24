import axios from 'axios';
import { BASE_URL } from '@/constants.ts';
import { DeviceMode, DeviceType } from '@/types.ts';

type RegisterDevice = {
	type: DeviceType;
	state: DeviceMode;
	name?: string;
};

export const registerDevice = async (body: RegisterDevice) => {
	return axios.post(`${BASE_URL}/device-register`, body);
};
