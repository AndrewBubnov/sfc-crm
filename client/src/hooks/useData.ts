import { useEffect, useMemo } from 'react';
import { filterResolver } from '@/constants.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSubscribe } from '@/hooks/useSubscribe.ts';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { useQueryParams } from '@/hooks/useQueryParams.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { DeviceDataType } from '@/types.ts';
import { usePagination } from '@/hooks/usePagination.ts';

export const useData = () => {
	const { filters: rawFilters, sort, limit } = useQueryParams();
	const { page, setPage } = usePagination();

	const filters = useDebounced(rawFilters, filterResolver);

	const { data, isFetching } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, sort, limit, filters],
		queryFn: () => getDevicesData({ page, sort, limit, filters }),
		placeholderData: keepPreviousData,
	});

	useSubscribe();

	useEffect(() => {
		if (page > 1 && !data?.data.items?.length && !isFetching) setPage(page - 1);
	}, [data?.data.items?.length, isFetching, page, setPage]);

	return useMemo(
		() => ({
			data: data?.data.items || [],
			total: data?.data.total || 0,
			isInitFetching: isFetching && !data,
			isFetching,
		}),
		[data, isFetching]
	);
};
