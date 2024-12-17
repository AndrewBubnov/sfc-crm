import { useCallback, useMemo } from 'react';
import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { Filter, Sort } from '@/types.ts';
import {
	getSingleValueParam,
	getReducedFilterQueryParams,
	getSortParam,
	updateSingleValueParam,
	updateSortParam,
} from '@/modules/shared/utils.ts';
import { BASE_LIMIT } from '@/modules/shared/constants.ts';

export const useQueryParams = () => {
	const [params, setParams] = useSearchParams();
	const paramsList = useMemo(() => [...params], [params]);

	const { filters } = useMemo(() => getReducedFilterQueryParams(paramsList), [paramsList]);

	const sort = getSortParam(paramsList);
	const page = getSingleValueParam(paramsList, 'page', 1);
	const limit = getSingleValueParam(paramsList, 'limit', BASE_LIMIT);

	const setFilter = useCallback(
		(filter: Filter) => {
			const { queryParams } = getReducedFilterQueryParams(paramsList, filter);
			setParams([['limit', String(limit)], ['page', String(page)], ...queryParams] as ParamKeyValuePair[]);
		},
		[limit, page, paramsList, setParams]
	);

	const resetFilters = useCallback(() => {
		setParams([
			['limit', String(limit)],
			['page', String(page)],
		]);
	}, [limit, page, setParams]);

	const setLimitParam = useCallback(
		(limit: number) => setParams(updateSingleValueParam(paramsList, limit, 'limit') as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const setSortParam = useCallback(
		(sorting: Sort) => setParams(updateSortParam(paramsList, sorting) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	return useMemo(
		() => ({
			paramsList,
			setParams,
			setFilter,
			resetFilters,
			filters,
			sort,
			limit,
			setLimitParam,
			setSortParam,
		}),
		[filters, limit, paramsList, resetFilters, setFilter, setLimitParam, setParams, setSortParam, sort]
	);
};
