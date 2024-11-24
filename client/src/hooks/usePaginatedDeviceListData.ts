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
	searchField: string;
	search?: string;
};

export const usePaginatedDeviceListData = ({ search, searchField, sortBy, sortDesc }: UseDeviceData) => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(BASE_LIMIT);

	const { data, isFetching, refetch } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, search, sortBy, sortDesc, limit],
		queryFn: () => getDevicesData({ page, search, sortBy, sortDesc, limit, searchField }),
		placeholderData: keepPreviousData,
	});

	const paramsRef = useLatest({ page, search, sortBy, sortDesc, limit, searchField }); // to avoid re-subscribe to SSE on change page or sort

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data);
			const { page, search, sortBy, sortDesc, limit, searchField } = paramsRef.current;
			queryClient.setQueryData(
				[QueryKeys.Devices, page, search, sortBy, sortDesc, limit, searchField],
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
		if (search?.length) setPage(1);
	}, [search?.length]);

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
