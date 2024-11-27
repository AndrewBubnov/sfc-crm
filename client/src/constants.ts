import { Filter } from '@/types.ts';

export const BASE_URL = 'http://localhost:8000';
export const BASE_LIMIT = 10;
export const MAX_SEARCH_STRING_LENGTH = 50;

export const filterResolver = (filters: Filter[]) =>
	!filters.length || filters.every(filter => filter.search.length <= MAX_SEARCH_STRING_LENGTH);

export const StateGraphFillDto: Record<string, string> = {
	error: 'tomato',
	off: 'indigo',
	standby: 'limegreen',
	charging: 'green',
	all: 'lightgray',
};

export const TypeGraphFillDto: Record<string, string> = {
	type1: '#008080',
	type2: '#800080',
	type3: '#40e0d0',
	type4: '#dab600',
	all: 'lightgray',
};

export const initialFilters: Filter[] = [
	{ field: 'id', search: '' },
	{ field: 'name', search: '' },
	{ field: 'type', search: '' },
	{ field: 'state', search: '' },
];
