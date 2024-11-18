import { BASE_URL } from '@/constants.ts';
import axios from 'axios';

type GetDevicesData = {
	page: number;
	search?: string;
	isSorted?: boolean;
};

export const getDevicesData = async ({ page, search = '', isSorted = false }: GetDevicesData) => {
	if (search) return axios(`${BASE_URL}/devices?filter_by=${search}&sort_desc=${isSorted}`);
	return axios(`${BASE_URL}/devices?offset=${page * 10}&sort_desc=${isSorted}`);
};
