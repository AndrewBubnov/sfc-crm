import { BASE_URL } from '@/constants.ts';
import axios from 'axios';

type GetDevicesData = {
	page: number;
	sortBy: string;
	sortDesc: boolean;
	search?: string;
};

export const getDevicesData = async ({ page, search = '', sortBy, sortDesc }: GetDevicesData) => {
	const sortedBy = sortBy ? `&sort_by=${sortBy}` : '';
	if (search) return axios(`${BASE_URL}/devices?filter_by=${search}${sortedBy}&sort_desc=${sortDesc}`);
	return axios(`${BASE_URL}/devices?offset=${page * 10}${sortedBy}&sort_desc=${sortDesc}`);
};
