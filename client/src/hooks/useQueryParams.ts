import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { DataContext } from '@/providers/DataContext.ts';
import {
	getLimitParam,
	getPageParam,
	getReducedFilterQueryParams,
	getSortParam,
	updateLimitParam,
	updatePageParam,
	updateSortParam,
} from '@/utils.ts';
import { Filter, Sort } from '@/types.ts';

export const useQueryParams = () => {
	const { total, isFetching } = useContext(DataContext);
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

	const setPageParam = useCallback(
		(page: number) => setParams(updatePageParam(paramsList, page) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const setLimitParam = useCallback(
		(page: number) => setParams(updateLimitParam(paramsList, page) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const setSortParam = useCallback(
		(sorting: Sort) => setParams(updateSortParam(paramsList, sorting) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const page = useMemo(() => getPageParam(paramsList), [paramsList]);
	const sort = useMemo(() => getSortParam(paramsList), [paramsList]);
	const limit = useMemo(() => getLimitParam(paramsList), [paramsList]);

	const lastPage = Math.ceil(total / limit);
	const setNextPage = useCallback(() => setPageParam(page + 1), [page, setPageParam]);
	const setPrevPage = useCallback(() => setPageParam(page - 1), [page, setPageParam]);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || page === lastPage;

	useEffect(() => {
		if (lastPage && page > lastPage) setPageParam(lastPage);
	}, [lastPage, page, setPageParam]);

	return useMemo(
		() => ({
			setFilter,
			resetFilters,
			filters,
			sort,
			limit,
			setLimitParam,
			setPageParam,
			setSortParam,
			page,
			lastPage,
			setNextPage,
			setPrevPage,
			isNextStepDisabled,
			isPrevStepDisabled,
		}),
		[
			setFilter,
			resetFilters,
			filters,
			sort,
			limit,
			setLimitParam,
			setPageParam,
			setSortParam,
			page,
			lastPage,
			setNextPage,
			setPrevPage,
			isNextStepDisabled,
			isPrevStepDisabled,
		]
	);
};
