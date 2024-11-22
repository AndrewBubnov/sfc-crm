import { BASE_URL } from '@/constants.ts';
import axios from 'axios';

type GetDevicesData = {
	page: number;
	limit: number;
	sortBy: string;
	sortDesc: boolean;
	search?: string;
};

export const getDevicesData = async ({ page, limit, sortBy, sortDesc, search = '' }: GetDevicesData) => {
	const sortedBy = sortBy ? `&sort_by=${sortBy}` : '';
	if (search) return axios(`${BASE_URL}/devices?filter_by=${search}${sortedBy}&sort_desc=${sortDesc}&limit=${limit}`);
	return axios(`${BASE_URL}/devices?offset=${page * limit}${sortedBy}&sort_desc=${sortDesc}&limit=${limit}`);
};
