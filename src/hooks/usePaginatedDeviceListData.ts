import { useCallback, useEffect, useMemo, useState } from 'react';
import { Device, DeviceDataType } from '@/types.ts';
import { BASE_LIMIT, BASE_URL } from '@/constants.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/queryKeys.ts';
import { useLatest } from '@/hooks/useLatest.ts';

type UseDeviceData = {
	sortBy: string;
	sortDesc: boolean;
	search?: string;
};

export const usePaginatedDeviceListData = ({ search, sortBy, sortDesc }: UseDeviceData) => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(BASE_LIMIT);

	const { data, isFetching, refetch } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, search, sortBy, sortDesc, limit],
		queryFn: () => getDevicesData({ page, search, sortBy, sortDesc, limit }),
		placeholderData: keepPreviousData,
	});

	const paramsRef = useLatest({ page, search, sortBy, sortDesc, limit }); // to avoid re-subscribe to SSE on change page or sort

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data);
			const { page, search, sortBy, sortDesc, limit } = paramsRef.current;
			queryClient.setQueryData(
				[QueryKeys.Devices, page, search, sortBy, sortDesc, limit],
				(oldData?: DeviceDataType) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map(device =>
								device.id === updatedDevice.id ? updatedDevice : device
							),
						},
					};
				}
			);
		},
		[paramsRef, queryClient]
	);

	useEffect(() => {
		const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);

		eventSource.addEventListener('deviceCreated', refetch as EventListener);
		eventSource.addEventListener('deviceDeleted', refetch as EventListener);
		eventSource.addEventListener('deviceUpdate', updateDevice);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('deviceCreated', refetch as EventListener);
			eventSource.removeEventListener('deviceDeleted', refetch as EventListener);
			eventSource.removeEventListener('deviceUpdate', updateDevice);
		};
	}, [refetch, updateDevice]);

	const onChangeLimit = useCallback(
		(limitNumber: number) =>
			setLimit(prevLimit => {
				setPage(prevPage => Math.floor(prevPage * (prevLimit / limitNumber)) || 1);
				return limitNumber;
			}),
		[]
	);

	const setNextPage = useCallback(() => setPage(prevState => prevState + 1), []);
	const setPrevPage = useCallback(() => setPage(prevState => prevState - 1), []);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || (data?.data.total ?? 0) <= (page + 1) * limit;

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
				lastPage: Math.floor((data?.data.total ?? 0) / limit),
				limit,
				onChangeLimit,
			},
		}),
		[data, isFetching, isNextStepDisabled, isPrevStepDisabled, page, setNextPage, setPrevPage, limit]
	);
};
