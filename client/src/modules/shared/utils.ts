import { Filter, QueryParam, Sort } from '@/types.ts';

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

const addParam = (param: Record<string, string>): string[][] => Object.keys(param).map(el => [el, param[el]]);

const getGroupedLists = (list: string[][]) => {
	let first: string[] = [];
	return list
		.filter(el => el[0] === QueryParam.Field || el[0] === QueryParam.Search)
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
	const index = params.findIndex(el => el[0] === QueryParam.Field && el[1] === filter.field);
	const updated =
		index === -1
			? [...params, ...addParam(filter)]
			: [...params.slice(0, index), ...addParam(filter), ...params.slice(index + 2)];

	const grouped = getGroupedLists(updated);

	const filteredGrouped = grouped.filter(el => el[1][1].length);

	const filters = filteredGrouped.map(el => ({
		field: el[0][1],
		search: el[1][1],
	})) as Filter[];

	return { queryParams: filteredGrouped.flat(1), filters };
};

export const getSingleValueParam = (
	params: string[][],
	paramName: QueryParam.Page | QueryParam.Limit,
	defaultValue: number
) => {
	const result = params.find(el => el[0] === paramName)?.[1];
	const numericResult = Number(result);
	return Number.isNaN(numericResult) ? defaultValue : numericResult;
};

export const updateSingleValueParam = (
	paramsList: string[][],
	parameter: number,
	paramName: QueryParam.Page | QueryParam.Limit
) => {
	const index = paramsList.findIndex(el => el[0] === paramName);
	return index === -1
		? [...paramsList, [paramName, String(parameter)]]
		: [...paramsList.slice(0, index), [paramName, String(parameter)], ...paramsList.slice(index + 1)];
};

export const getSortParam = (params: string[][]) => {
	const index = params.findIndex(el => el[0] === QueryParam.SortBy);
	return index > -1 && params[index + 1]
		? { sortBy: params[index][1], sortDesc: params[index + 1][1] === 'true' }
		: { sortBy: '', sortDesc: false };
};

export const updateSortParam = (params: string[][], { sortBy, sortDesc }: Sort) => {
	const index = params.findIndex(el => el[0] === QueryParam.SortBy);
	if (index === -1) return [[QueryParam.SortBy, sortBy], [QueryParam.SortDesc, String(sortDesc)], ...params];
	const sortParams = getSortParam(params);
	if (sortParams.sortBy === sortBy && sortParams.sortDesc === sortDesc) {
		return [...params.slice(0, index), ...params.slice(index + 2)];
	}
	return [
		...params.slice(0, index),
		[QueryParam.SortBy, sortBy],
		[QueryParam.SortDesc, String(sortDesc)],
		...params.slice(index + 2),
	];
};

export const setSearchString = (params: string[][]) => {
	const searchString = params
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&');
	return window.history.pushState(null, '', `${window.location.pathname}?${searchString}`);
};
