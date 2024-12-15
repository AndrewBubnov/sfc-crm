import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { DataContext } from '@/providers/DataContext.ts';
import { getPageParam, getReducedFilterQueryParams, getSortParam, updatePageParams, updateSortParam } from '@/utils.ts';
import { Filter, Sort } from '@/types.ts';

export const useManageParams = () => {
	const { total, isFetching, limit } = useContext(DataContext);
	const [params, setParams] = useSearchParams();
	const paramsList = useMemo(() => [...params], [params]);

	const { filters } = useMemo(() => getReducedFilterQueryParams(paramsList), [paramsList]);

	const setFilter = useCallback(
		(filter: Filter) => {
			const page = getPageParam(paramsList);
			const { queryParams } = getReducedFilterQueryParams(paramsList, filter);
			setParams([['page', String(page)], ...queryParams] as ParamKeyValuePair[]);
		},
		[paramsList, setParams]
	);

	const resetFilters = useCallback(() => {
		const page = getPageParam(paramsList);
		setParams([['page', String(page)]]);
	}, [paramsList, setParams]);

	const setPageParam = useCallback(
		(page: number) => setParams(updatePageParams(paramsList, page) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const setSortParam = useCallback(
		(sorting: Sort) => setParams(updateSortParam(paramsList, sorting) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const page = useMemo(() => getPageParam(paramsList), [paramsList]);
	const sort = useMemo(() => getSortParam(paramsList), [paramsList]);

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
