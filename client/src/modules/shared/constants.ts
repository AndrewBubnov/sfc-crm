import { Filter } from '@/types.ts';

export const MAX_SEARCH_STRING_LENGTH = 50;

export const filterResolver = (filters: Filter[]) =>
	!filters.length || filters.every(filter => filter.search.length <= MAX_SEARCH_STRING_LENGTH);

export const BASE_URL = 'http://localhost:8000';

export const BASE_LIMIT = 10;
