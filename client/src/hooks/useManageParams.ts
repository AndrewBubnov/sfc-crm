import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Filter } from '@/types.ts';
import { getReducedFilterQueryParams } from '@/utils.ts';

export const useManageParams = () => {
	const [params, setParams] = useSearchParams();
	const paramsList = useMemo(() => [...params], [params]);

	const { filters } = useMemo(() => getReducedFilterQueryParams(paramsList), [paramsList]);

	const setFilter = useCallback(
		(filter: Filter) => {
			const { queryParams } = getReducedFilterQueryParams(paramsList, filter);
			setParams(queryParams as ParamKeyValuePair[]);
		},
		[paramsList, setParams]
	);

	const resetFilters = useCallback(() => setParams([]), [setParams]);

	return useMemo(
		() => ({
			setFilter,
			resetFilters,
			filters,
		}),
		[filters, resetFilters, setFilter]
	);
};
