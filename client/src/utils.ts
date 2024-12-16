import { Filter, Sort } from '@/types.ts';
import { BASE_LIMIT } from '@/constants.ts';

export const createIndexesList = (page: number, lastPage: number) => {
	const currentPage = Math.min(page, lastPage);
	const length = Math.min(lastPage, 3);
	if (currentPage === 1) {
		return Array.from({ length }, (_, index) => index + 1);
	}
	if (currentPage === lastPage) {
		return Array.from({ length }, (_, index) => {
			if (index === length - 1) return currentPage;
			if (index === length - 2) return currentPage - 1;
			return currentPage - 2;
		});
	}
	return Array.from({ length }, (_, index) => {
		if (!index) return currentPage - 1;
		if (index === 1) return currentPage;
		return currentPage + 1;
	});
};

export const capitalize = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const getDeleteToastMessage = (list: string[]) =>
	`Device${list.length > 1 ? 's' : ''} with ID${list.length > 1 ? 's' : ''}: ${list.join()} ha${
		list.length > 1 ? 've' : 's'
	} successfully been deleted`;

export const setGraphData = (statistics: Record<string, number>, total: number, dto: Record<string, string>) => {
	const keys = Object.keys(statistics);
	if (keys.length === 1) {
		const [key] = keys;
		return [
			{ name: key, value: statistics[key], fill: dto[key] },
			{ name: 'rest', value: total - statistics[key], fill: dto['all'] },
		];
	}
	return keys.map(key => ({
		name: key,
		value: statistics[key],
		fill: dto[key],
	}));
};

export const createFilterQueryString = (filters: Filter[]) => {
	const filtersToFetch = filters.filter(el => Boolean(el.field) && Boolean(el.search));
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

export const addParam = (param: Record<string, string>): string[][] => Object.keys(param).map(el => [el, param[el]]);

const getGroupedLists = (list: string[][]) => {
	let first: string[] = [];
	return list
		.filter(el => el[0] === 'field' || el[0] === 'search')
		.reduce(
			(acc, cur, currentIndex) => {
				if (currentIndex % 2 === 0) {
					first = cur;
					return acc;
				}
				acc.push([first, cur]);
				return acc;
			},
			[] as string[][][]
		);
};

export const getReducedFilterQueryParams = (params: string[][], filter: Filter = {} as Filter) => {
	const index = params.findIndex(el => el[0] === 'field' && el[1] === filter.field);
	const updated =
		index === -1
			? [...params, ...addParam(filter)]
			: [...params.slice(0, index), ...addParam(filter), ...params.slice(index + 2)];

	const grouped = getGroupedLists(updated);

	const filteredGrouped = grouped.filter(el => el[1][1].length);

	const filters = filteredGrouped.map(el => ({
		field: el[0][1],
		search: el[1][1],
	}));

	return { queryParams: filteredGrouped.flat(1), filters };
};

export const getPageParam = (params: string[][]) => {
	const page = params.find(el => el[0] === 'page')?.[1];
	return page ? +page : 1;
};

export const getLimitParam = (params: string[][]) => {
	const limit = params.find(el => el[0] === 'limit')?.[1];
	return limit ? +limit : BASE_LIMIT;
};

export const updatePageParam = (params: string[][], page: number) => {
	const index = params.findIndex(el => el[0] === 'page');
	return index === -1
		? [...params, ['page', String(page)]]
		: [...params.slice(0, index), ['page', String(page)], ...params.slice(index + 1)];
};

export const updateLimitParam = (params: string[][], limit: number) => {
	const index = params.findIndex(el => el[0] === 'limit');
	return index === -1
		? [...params, ['limit', String(limit)]]
		: [...params.slice(0, index), ['limit', String(limit)], ...params.slice(index + 1)];
};

export const getSortParam = (params: string[][]) => {
	const index = params.findIndex(el => el[0] === 'sortBy');
	return index > -1 && params[index + 1]
		? { sortBy: params[index][1], sortDesc: params[index + 1][1] === 'true' }
		: { sortBy: '', sortDesc: false };
};

export const updateSortParam = (params: string[][], { sortBy, sortDesc }: Sort) => {
	const index = params.findIndex(el => el[0] === 'sortBy');
	if (index === -1) return [['sortBy', sortBy], ['sortDesc', String(sortDesc)], ...params];
	const sortParams = getSortParam(params);
	if (sortParams.sortBy === sortBy && sortParams.sortDesc === sortDesc) {
		return [...params.slice(0, index), ...params.slice(index + 2)];
	}
	return [...params.slice(0, index), ['sortBy', sortBy], ['sortDesc', String(sortDesc)], ...params.slice(index + 2)];
};
