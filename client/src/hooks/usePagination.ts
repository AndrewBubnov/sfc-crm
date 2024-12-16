import { useCallback, useEffect, useMemo } from 'react';
import { ParamKeyValuePair } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams.ts';
import { getPageParam, updatePageParam } from '@/utils.ts';
import { useGetQueryDetails } from '@/hooks/useGetQueryDetails.ts';

export const usePagination = () => {
	const { total, isFetching } = useGetQueryDetails();

	const { paramsList, setParams, limit } = useQueryParams();

	const page = useMemo(() => getPageParam(paramsList), [paramsList]);

	const setPage = useCallback(
		(page: number) => setParams(updatePageParam(paramsList, page) as ParamKeyValuePair[]),
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
