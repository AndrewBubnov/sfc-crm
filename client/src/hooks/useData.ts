import { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_LIMIT, filterResolver } from '@/constants.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLatest } from '@/hooks/useLatest.ts';
import { useSubscribe } from '@/hooks/useSubscribe.ts';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { useManageParams } from '@/hooks/useManageParams.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { DeviceDataType } from '@/types.ts';

export const useData = () => {
	const { filters: rawFilters, setPageParam, page, sort } = useManageParams();

	const filters = useDebounced(rawFilters, filterResolver);

	const [limit, setLimit] = useState<number>(BASE_LIMIT);

	const { data, isFetching } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, sort, limit, filters],
		queryFn: () => getDevicesData({ page, sort, limit, filters }),
		placeholderData: keepPreviousData,
	});

	const paramsRef = useLatest({ page, sort, limit, filters });

	useSubscribe(paramsRef);

	useEffect(() => {
		if (page > 1 && !data?.data.items?.length && !isFetching) setPageParam(page - 1);
	}, [data?.data.items?.length, isFetching, page, setPageParam]);

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

	return useMemo(
		() => ({
			data: data?.data.items || [],
			total: data?.data.total || 0,
			isInitFetching: isFetching && !data,
			isFetching,
			limit,
			onChangeLimit,
		}),
		[data, isFetching, limit, onChangeLimit]
	);
};
