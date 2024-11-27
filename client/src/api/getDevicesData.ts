import { BASE_URL } from '@/constants.ts';
import axios from 'axios';
import { Filter } from '@/types.ts';
import { createFilterQueryString } from '@/utils.ts';

type GetDevicesData = {
	page: number;
	limit: number;
	sortBy: string;
	sortDesc: boolean;
	filters: Filter[];
};

export const getDevicesData = async ({ page, limit, sortBy, sortDesc, filters }: GetDevicesData) => {
	const sorted = sortBy ? `&sort_by=${sortBy}&sort_desc=${sortDesc}` : '';
	const base = `${BASE_URL}/devices?offset=${page * limit}${sorted}&limit=${limit}`;

	if (filters.length) return axios(`${base}${createFilterQueryString(filters)}`);
	return axios(base);
};
