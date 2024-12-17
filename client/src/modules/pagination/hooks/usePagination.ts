import { useCallback, useEffect, useMemo } from 'react';
import { ParamKeyValuePair } from 'react-router-dom';
import { useQueryParams } from '@/modules/shared/hooks/useQueryParams.ts';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';
import { getSingleValueParam, updateSingleValueParam } from '@/modules/shared/utils.ts';

export const usePagination = () => {
	const { total, isFetching } = useGetQueryDetails();

	const { paramsList, setParams, limit } = useQueryParams();

	const page = useMemo(() => getSingleValueParam(paramsList, 'page', 1), [paramsList]);

	const setPage = useCallback(
		(page: number) => setParams(updateSingleValueParam(paramsList, page, 'page') as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const lastPage = Math.ceil(total / limit);
	const setNextPage = useCallback(() => setPage(page + 1), [page, setPage]);
	const setPrevPage = useCallback(() => setPage(page - 1), [page, setPage]);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || page === lastPage;

	useEffect(() => {
		if (lastPage && page > lastPage) setPage(lastPage);
	}, [lastPage, page, setPage]);

	return useMemo(
		() => ({
			setPage,
			page,
			lastPage,
			setNextPage,
			setPrevPage,
			isNextStepDisabled,
			isPrevStepDisabled,
		}),
		[setPage, page, lastPage, setNextPage, setPrevPage, isNextStepDisabled, isPrevStepDisabled]
	);
};
