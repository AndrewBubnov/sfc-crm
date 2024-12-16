import axios from 'axios';
import { BASE_URL } from '@/modules/shared/constants.ts';

type RenameDevice = {
	deviceId: string;
	name: string;
};

export const renameDevice = async ({ deviceId, name }: RenameDevice) => {
	return axios.put(`${BASE_URL}/devices/${deviceId}/rename`, { name });
};
