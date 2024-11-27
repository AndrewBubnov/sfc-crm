import { BASE_URL } from '@/constants.ts';
import axios from 'axios';
import { Filter } from '@/types.ts';

type GetDevicesData = {
	page: number;
	limit: number;
	sortBy: string;
	sortDesc: boolean;
	filters: Filter[];
};

const createFilterQueryString = (filters: Filter[]) => {
	const filtersToFetch = filters.filter(el => Boolean(el.search));
	const searchQueryString = filtersToFetch
		.map(el => el.search)
		.reduce((acc, cur) => {
			acc = `${acc}&filter_by=${cur}`;
			return acc;
		}, '');
	const searchFieldQueryString = filtersToFetch
		.map(el => el.field)
		.reduce((acc, cur) => {
			acc = `${acc}&filter_field=${cur}`;
			return acc;
		}, '');
	return `${searchQueryString}${searchFieldQueryString}`;
};

export const getDevicesData = async ({ page, limit, sortBy, sortDesc, filters }: GetDevicesData) => {
	const sorted = sortBy ? `&sort_by=${sortBy}&sort_desc=${sortDesc}` : '';
	const base = `${BASE_URL}/devices?offset=${page * limit}${sorted}&limit=${limit}`;

	if (filters.length) return axios(`${base}${createFilterQueryString(filters)}`);
	return axios(base);
};
