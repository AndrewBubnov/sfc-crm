import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceDataType } from '@/types.ts';
import { BASE_LIMIT, filterResolver } from '@/constants.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/queryKeys.ts';
import { useLatest } from '@/hooks/useLatest.ts';
import { useSubscribe } from '@/hooks/useSubscribe.ts';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { useManageParams } from '@/hooks/useManageParams.ts';

type UseDeviceData = {
	sortBy: string;
	sortDesc: boolean;
};

export const usePaginatedDeviceListData = ({ sortBy, sortDesc }: UseDeviceData) => {
	const { filters: rawFilters, setPageParam, page } = useManageParams();

	const filters = useDebounced(rawFilters, filterResolver);

	const [limit, setLimit] = useState<number>(BASE_LIMIT);

	const { data, isFetching } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, sortBy, sortDesc, limit, filters],
		queryFn: () => getDevicesData({ page, sortBy, sortDesc, limit, filters }),
		placeholderData: keepPreviousData,
	});

	const paramsRef = useLatest({ page, sortBy, sortDesc, limit, filters });

	useSubscribe(paramsRef);

	useEffect(() => {
		if (page > 1 && !data?.data.items.length && !isFetching) setPageParam(page - 1);
	}, [data?.data.items.length, isFetching, page, setPageParam]);

	const onChangeLimit = useCallback(
		(limitNumber: number) =>
			setLimit(prevLimit => {
				const newPage = Math.floor(page * (prevLimit / limitNumber)) || 1;
				const maxPages = Math.ceil((data?.data.total || 0) / limitNumber);
				setPageParam(Math.min(newPage, maxPages) || 1);
				return limitNumber;
			}),
		[data?.data.total, page, setPageParam]
	);

	const lastPage = Math.ceil((data?.data.total ?? 0) / limit);
	const setNextPage = useCallback(() => setPageParam(page + 1), [page, setPageParam]);
	const setPrevPage = useCallback(() => setPageParam(page - 1), [page, setPageParam]);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || page === lastPage;

	useEffect(() => {
		if (lastPage && page > lastPage) setPageParam(lastPage);
	}, [lastPage, page, setPageParam]);

	return useMemo(
		() => ({
			data: data?.data.items || [],
			isInitFetching: isFetching && !data,
			paginationData: {
				setNextPage,
				setPrevPage,
				page,
				isPrevStepDisabled,
				isNextStepDisabled,
				lastPage,
				limit,
				onChangeLimit,
				isFetching,
			},
		}),
		[
			data,
			isFetching,
			setNextPage,
			setPrevPage,
			page,
			isPrevStepDisabled,
			isNextStepDisabled,
			lastPage,
			limit,
			onChangeLimit,
		]
	);
};
