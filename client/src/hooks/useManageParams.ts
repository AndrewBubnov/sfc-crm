import { ParamKeyValuePair, useSearchParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Filter } from '@/types.ts';
import { getReducedFilterQueryParams } from '@/utils.ts';

export const useManageParams = () => {
	const [filters, setFilters] = useState<Filter[]>([]);
	const [params, setParams] = useSearchParams();

	const setQueryParams = useCallback(
		(filter: Filter) => {
			const { queryParams, filters } = getReducedFilterQueryParams([...params], filter);
			setFilters(filters);
			setParams(queryParams as ParamKeyValuePair[]);
		},
		[params, setParams]
	);
	return { setQueryParams, filters };
};
