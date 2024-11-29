import { Filter } from '@/types.ts';

export const BASE_URL = 'http://localhost:8000';
export const BASE_LIMIT = 10;
export const MAX_SEARCH_STRING_LENGTH = 50;

export const filterResolver = (filters: Filter[]) =>
	!filters.length || filters.every(filter => filter.search.length <= MAX_SEARCH_STRING_LENGTH);

export const StateGraphFillDto: Record<string, string> = {
	error: '#FF6347',
	off: '#4B0082',
	standby: '#32CD32',
	charging: '#008000',
	all: '#D3D3D3',
};

export const TypeGraphFillDto: Record<string, string> = {
	type1: '#008080',
	type2: '#800080',
	type3: '#40e0d0',
	type4: '#dab600',
	all: '#D3D3D3',
};

export const initialFilters: Filter[] = [
	{ field: 'id', search: '' },
	{ field: 'name', search: '' },
	{ field: 'type', search: '' },
	{ field: 'state', search: '' },
];
