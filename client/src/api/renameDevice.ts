import { BASE_URL } from '@/constants.ts';
import axios from 'axios';

type RenameDevice = {
	deviceId: string;
	name: string;
};

export const renameDevice = async ({ deviceId, name }: RenameDevice) => {
	return axios.put(`${BASE_URL}/devices/${deviceId}/rename`, { name });
};
