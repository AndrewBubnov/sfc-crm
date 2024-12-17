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
import { useGetQueryData } from '@/modules/shared/hooks/useGetQueryData.ts';

export const useManageSearchParams = () => {
	const [params, setParams] = useSearchParams();

	const paramsList = useMemo(() => [...params], [params]);

	const { filters } = useMemo(() => getReducedFilterQueryParams(paramsList), [paramsList]);
	const sort = getSortParam(paramsList);
	const page = getSingleValueParam(paramsList, 'page', 1);
	const limit = getSingleValueParam(paramsList, 'limit', BASE_LIMIT);

	const queryData = useGetQueryData({ page, limit, filters, sort });

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

	const onLimitChange = useCallback(
		(updatedLimit: number) => {
			const updatedLimitParamsList = updateSingleValueParam(paramsList, updatedLimit, 'limit');
			setParams(updatedLimitParamsList as ParamKeyValuePair[]);
			const newPage = Math.floor(page * (limit / updatedLimit)) || 1;
			const maxPages = Math.ceil((queryData?.total || 0) / updatedLimit);
			setParams(
				updateSingleValueParam(
					updatedLimitParamsList,
					Math.min(newPage, maxPages) || 1,
					'page'
				) as ParamKeyValuePair[]
			);
		},
		[limit, page, paramsList, queryData?.total, setParams]
	);

	const setSortParam = useCallback(
		(sorting: Sort) => setParams(updateSortParam(paramsList, sorting) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	return useMemo(
		() => ({
			page,
			paramsList,
			setParams,
			setFilter,
			resetFilters,
			filters,
			sort,
			limit,
			onLimitChange,
			setSortParam,
		}),
		[filters, limit, page, paramsList, resetFilters, setFilter, onLimitChange, setParams, setSortParam, sort]
	);
};
