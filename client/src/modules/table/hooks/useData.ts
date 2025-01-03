import { useContext, useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { SearchParamsContext } from '@/providers/SearchParamsContext.ts';
import { useSubscribe } from '@/modules/table/hooks/useSubscribe.ts';
import { useDebounced } from '@/modules/table/hooks/useDebounced.ts';
import { getDevicesData } from '@/modules/table/api/getDevicesData.ts';
import { usePagination } from '@/modules/pagination/hooks/usePagination.ts';
import { filterResolver } from '@/modules/shared/constants.ts';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';
import { DeviceDataType } from '@/types.ts';

export const useData = () => {
	const { filters: rawFilters, sort, limit } = useContext(SearchParamsContext);
	const { page } = usePagination();

	const filters = useDebounced(rawFilters, filterResolver);

	const { data, isFetching } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, sort, limit, filters],
		queryFn: () => getDevicesData({ page, sort, limit, filters }),
		placeholderData: keepPreviousData,
	});

	useSubscribe();

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
