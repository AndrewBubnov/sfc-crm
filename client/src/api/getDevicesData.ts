import { BASE_URL } from '@/constants.ts';
import axios from 'axios';
import { createFilterQueryString } from '@/utils.ts';
import { Filter, Sort } from '@/types.ts';

type GetDevicesData = {
	page: number;
	limit: number;
	sort: Sort;
	filters: Filter[];
};

export const getDevicesData = async ({ page, limit, sort, filters }: GetDevicesData) => {
	const sorted = sort.sortBy ? `&sort_by=${sort.sortBy}&sort_desc=${sort.sortDesc}` : '';
	const base = `${BASE_URL}/devices?offset=${page * limit}${sorted}&limit=${limit}`;

	if (filters.length) return axios(`${base}${createFilterQueryString(filters)}`);
	return axios(base);
};
