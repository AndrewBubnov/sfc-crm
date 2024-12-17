import { useCallback, useEffect, useMemo } from 'react';
import { ParamKeyValuePair } from 'react-router-dom';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';
import { updateSingleValueParam } from '@/modules/shared/utils.ts';

export const usePagination = () => {
	const { total, isFetching } = useGetQueryDetails();

	const { page, paramsList, setParams, limit } = useManageSearchParams();

	const setPage = useCallback(
		(updatedPage: number) =>
			setParams(updateSingleValueParam(paramsList, updatedPage, 'page') as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const lastPage = Math.max(Math.ceil((total || 0) / limit), 1);
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
