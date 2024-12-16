import { useCallback, useMemo } from 'react';
import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { Filter, Sort } from '@/types.ts';
import {
	getLimitParam,
	getPageParam,
	getReducedFilterQueryParams,
	getSortParam,
	updateLimitParam,
	updateSortParam,
} from '@/modules/shared/utils.ts';

export const useQueryParams = () => {
	const [params, setParams] = useSearchParams();
	const paramsList = useMemo(() => [...params], [params]);

	const { filters } = useMemo(() => getReducedFilterQueryParams(paramsList), [paramsList]);

	const setFilter = useCallback(
		(filter: Filter) => {
			const page = getPageParam(paramsList);
			const limit = getLimitParam(paramsList);
			const { queryParams } = getReducedFilterQueryParams(paramsList, filter);
			setParams([['limit', String(limit)], ['page', String(page)], ...queryParams] as ParamKeyValuePair[]);
		},
		[paramsList, setParams]
	);

	const resetFilters = useCallback(() => {
		const page = getPageParam(paramsList);
		const limit = getLimitParam(paramsList);
		setParams([
			['limit', String(limit)],
			['page', String(page)],
		]);
	}, [paramsList, setParams]);

	const setLimitParam = useCallback(
		(page: number) => setParams(updateLimitParam(paramsList, page) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const setSortParam = useCallback(
		(sorting: Sort) => setParams(updateSortParam(paramsList, sorting) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const sort = useMemo(() => getSortParam(paramsList), [paramsList]);
	const limit = useMemo(() => getLimitParam(paramsList), [paramsList]);

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
