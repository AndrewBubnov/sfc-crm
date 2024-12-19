import { useCallback, useContext, useMemo, useReducer } from 'react';
import { Filter, QueryParam, Sort } from '@/types.ts';
import {
	getSingleValueParam,
	getReducedFilterQueryParams,
	getSortParam,
	updateSingleValueParam,
	updateSortParam,
	setSearchString,
} from '@/modules/shared/utils.ts';
import { BASE_LIMIT } from '@/modules/shared/constants.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';

export const useManageSearchParams = () => {
	const { filteredTotal: total } = useContext(StatisticsContext);
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const search = window.location.search;

	const paramsList = useMemo(() => [...new URLSearchParams(search)], [search]);

	const { filters } = useMemo(() => getReducedFilterQueryParams(paramsList), [paramsList]);
	const sort = getSortParam(paramsList);
	const page = getSingleValueParam(paramsList, QueryParam.Page, 1);
	const limit = getSingleValueParam(paramsList, QueryParam.Limit, BASE_LIMIT);

	const setParams = useCallback((params: string[][]) => {
		setSearchString(params);
		forceUpdate();
	}, []);

	const onFilterChange = useCallback(
		(filter: Filter) => {
			const { queryParams } = getReducedFilterQueryParams(paramsList, filter);
			setParams([[QueryParam.Limit, String(limit)], [QueryParam.Page, String(page)], ...queryParams]);
		},
		[limit, page, paramsList, setParams]
	);

	const resetFilters = useCallback(() => {
		setParams([
			['limit', String(limit)],
			['page', String(page)],
		]);
	}, [limit, page, setParams]);

	const onLimitChange = useCallback(
		(updatedLimit: number) => {
			const updatedLimitParamsList = updateSingleValueParam(paramsList, updatedLimit, QueryParam.Limit);
			setParams(updatedLimitParamsList);
			const newPage = Math.floor(page * (limit / updatedLimit)) || 1;
			const maxPages = Math.ceil(total / updatedLimit);
			setParams(
				updateSingleValueParam(updatedLimitParamsList, Math.min(newPage, maxPages) || 1, QueryParam.Page)
			);
		},
		[limit, page, paramsList, setParams, total]
	);

	const onSortChange = useCallback(
		(sorting: Sort) => setParams(updateSortParam(paramsList, sorting)),
		[paramsList, setParams]
	);

	return useMemo(
		() => ({
			page,
			paramsList,
			setParams,
			onFilterChange,
			resetFilters,
			filters,
			sort,
			limit,
			onLimitChange,
			onSortChange,
		}),
		[page, paramsList, setParams, onFilterChange, resetFilters, filters, sort, limit, onLimitChange, onSortChange]
	);
};
