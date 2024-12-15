import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ParamKeyValuePair } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams.ts';
import { DataContext } from '@/providers/DataContext.ts';
import { getLimitParam, getPageParam, getSortParam, updatePageParam } from '@/utils.ts';

export const usePagination = () => {
	const { total, isFetching } = useContext(DataContext);
	const { paramsList, setParams } = useQueryParams();

	const setPage = useCallback(
		(page: number) => setParams(updatePageParam(paramsList, page) as ParamKeyValuePair[]),
		[paramsList, setParams]
	);

	const page = useMemo(() => getPageParam(paramsList), [paramsList]);
	const sort = useMemo(() => getSortParam(paramsList), [paramsList]);
	const limit = useMemo(() => getLimitParam(paramsList), [paramsList]);

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
			sort,
			limit,
			setPage,
			page,
			lastPage,
			setNextPage,
			setPrevPage,
			isNextStepDisabled,
			isPrevStepDisabled,
		}),
		[sort, limit, setPage, page, lastPage, setNextPage, setPrevPage, isNextStepDisabled, isPrevStepDisabled]
	);
};
