import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Filter } from '@/types.ts';
import { getPageParam, getReducedFilterQueryParams, managePageParams } from '@/utils.ts';

export const useManageParams = () => {
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
		(page: number) => setParams(managePageParams(paramsList, page) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);
	const page = useMemo(() => getPageParam(paramsList), [paramsList]);

	return useMemo(
		() => ({
			setFilter,
			resetFilters,
			filters,
			setPageParam,
			page,
		}),
		[filters, page, resetFilters, setFilter, setPageParam]
	);
};
