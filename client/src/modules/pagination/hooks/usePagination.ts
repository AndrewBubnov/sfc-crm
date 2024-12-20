import { useCallback, useContext, useEffect, useMemo } from 'react';
import { SearchParamsContext } from '@/providers/SearchParamsContext.ts';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';
import { updateSingleValueParam } from '@/modules/shared/utils.ts';
import { QueryParam } from '@/types.ts';

export const usePagination = () => {
	const { filteredTotal: total, isFetching } = useGetQueryDetails();

	const { page, paramsList, setParams, limit } = useContext(SearchParamsContext);

	const setPage = useCallback(
		(updatedPage: number) => setParams(updateSingleValueParam(paramsList, updatedPage, QueryParam.Page)),
		[paramsList, setParams]
	);

	const lastPage = Math.max(Math.ceil((total || 0) / limit), 1);
	const setNextPage = useCallback(() => setPage(page + 1), [page, setPage]);
	const setPrevPage = useCallback(() => setPage(page - 1), [page, setPage]);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || page === lastPage;

	useEffect(() => {
		if (total && page > lastPage) setPage(lastPage);
	}, [lastPage, page, setPage, total]);

	useEffect(() => {
		if (page > 1 && !total && !isFetching) setPage(page - 1);
	}, [total, isFetching, page, setPage]);

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
