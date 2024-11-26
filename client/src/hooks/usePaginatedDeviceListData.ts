import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DeviceDataType } from '@/types.ts';
import { BASE_LIMIT, filterResolver } from '@/constants.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/queryKeys.ts';
import { useLatest } from '@/hooks/useLatest.ts';
import { useSubscribe } from '@/hooks/useSubscribe.ts';
import { FilteringContext } from '@/providers/FilteringContext.ts';
import { useDebounced } from '@/hooks/useDebounced.ts';

type UseDeviceData = {
	sortBy: string;
	sortDesc: boolean;
};

export const usePaginatedDeviceListData = ({ sortBy, sortDesc }: UseDeviceData) => {
	const { filters: rawFilters } = useContext(FilteringContext);
	const filters = useDebounced(rawFilters, filterResolver);

	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(BASE_LIMIT);

	const { data, isFetching, refetch } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, sortBy, sortDesc, limit, filters],
		queryFn: () => getDevicesData({ page, sortBy, sortDesc, limit, filters }),
		placeholderData: keepPreviousData,
	});

	const paramsRef = useLatest({ page, sortBy, sortDesc, limit, filters });

	useSubscribe({ paramsRef, refetch });

	useEffect(() => {
		if (filters.length) setPage(1);
	}, [filters.length]);

	const onChangeLimit = useCallback(
		(limitNumber: number) =>
			setLimit(prevLimit => {
				setPage(prevPage => Math.floor(prevPage * (prevLimit / limitNumber)) || 1);
				return limitNumber;
			}),
		[]
	);

	const lastPage = Math.ceil((data?.data.total ?? 0) / limit);
	const setNextPage = useCallback(() => setPage(prevState => prevState + 1), []);
	const setPrevPage = useCallback(() => setPage(prevState => prevState - 1), []);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || page === lastPage;

	return useMemo(
		() => ({
			data: data?.data.items || [],
			isInitFetching: isFetching && !data,
			paginationData: {
				setPage,
				setNextPage,
				setPrevPage,
				page,
				isPrevStepDisabled,
				isNextStepDisabled,
				lastPage,
				limit,
				onChangeLimit,
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
