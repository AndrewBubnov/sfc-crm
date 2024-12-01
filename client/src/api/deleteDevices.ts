import axios from 'axios';
import { BASE_URL } from '@/constants.ts';

type DeleteDevices = {
	ids: string[];
};

export const deleteDevices = async (body: DeleteDevices) => {
	return axios.post(`${BASE_URL}/devices/delete`, body);
};
