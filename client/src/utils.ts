import { Filter } from '@/types.ts';

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
	return list.reduce(
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
