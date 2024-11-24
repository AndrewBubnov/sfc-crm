import { BASE_URL } from '@/constants.ts';
import axios from 'axios';

type GetDevicesData = {
	page: number;
	limit: number;
	sortBy: string;
	sortDesc: boolean;
	searchField: string;
	search?: string;
};

export const getDevicesData = async ({ page, limit, sortBy, sortDesc, searchField, search = '' }: GetDevicesData) => {
	const sorted = sortBy ? `&sort_by=${sortBy}&sort_desc=${sortDesc}` : '';
	const base = `${BASE_URL}/devices?offset=${page * limit}${sorted}&limit=${limit}`;
	if (search) return axios(`${base}&filter_by=${search}&filter_field=${searchField}`);
	return axios(base);
};
