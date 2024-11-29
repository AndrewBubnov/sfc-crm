import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DeviceDataType } from '@/types.ts';
import { BASE_LIMIT, filterResolver } from '@/constants.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { useLatest } from '@/hooks/useLatest.ts';
import { useSubscribe } from '@/hooks/useSubscribe.ts';
import { FilteringContext } from '@/providers/FilteringContext.ts';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { useQuery } from '@/react-mini-query';

type UseDeviceData = {
	sortBy: string;
	sortDesc: boolean;
};

export const usePaginatedDeviceListData = ({ sortBy, sortDesc }: UseDeviceData) => {
	const { filters: rawFilters } = useContext(FilteringContext);
	const filters = useDebounced(rawFilters, filterResolver);

	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(BASE_LIMIT);

	const { data, isLoading, refetch } = useQuery<DeviceDataType>({
		queryKey: [QueryKeys.Devices, page, sortBy, sortDesc, limit, filters],
		queryFn: () => getDevicesData({ page, sortBy, sortDesc, limit, filters }),
		keepPreviousData: true,
	});

	const paramsRef = useLatest({ page, sortBy, sortDesc, limit, filters });

	useSubscribe({ paramsRef, refetch });

	useEffect(() => setPage(1), [filters]);

	const onChangeLimit = useCallback(
		(limitNumber: number) =>
			setLimit(prevLimit => {
				setPage(prevPage => {
					const newPage = Math.floor(prevPage * (prevLimit / limitNumber)) || 1;
					const maxPages = Math.ceil((data?.data.total || 0) / limitNumber);
					return Math.min(newPage, maxPages) || 1;
				});
				return limitNumber;
			}),
		[data?.data.total]
	);

	const lastPage = Math.ceil((data?.data.total ?? 0) / limit);
	const setNextPage = useCallback(() => setPage(prevState => prevState + 1), []);
	const setPrevPage = useCallback(() => setPage(prevState => prevState - 1), []);
	const isPrevStepDisabled = isLoading || page === 1;
	const isNextStepDisabled = isLoading || page === lastPage;

	return useMemo(
		() => ({
			data: data?.data.items || [],
			isInitFetching: isLoading && !data,
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
			isLoading,
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
