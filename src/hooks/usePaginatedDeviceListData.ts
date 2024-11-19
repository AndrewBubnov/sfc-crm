import { useCallback, useEffect, useMemo, useState } from 'react';
import { Device, DeviceDataType } from '@/types.ts';
import { BASE_LIMIT, BASE_URL } from '@/constants.ts';
import { getDevicesData } from '@/api/getDevicesData.ts';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/queryKeys.ts';

type UseDeviceData = {
	search?: string;
	isSorted?: boolean;
};

export const usePaginatedDeviceListData = ({ search, isSorted }: UseDeviceData) => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState<number>(1);

	const { data, isFetching, refetch } = useQuery<DeviceDataType, Error>({
		queryKey: [QueryKeys.Devices, page, search, isSorted],
		queryFn: () => getDevicesData({ page, search, isSorted }),
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);

		const updateDevice = (evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data);
			queryClient.setQueryData([QueryKeys.Devices, page, search, isSorted], (oldData?: DeviceDataType) => {
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
			});
		};

		eventSource.addEventListener('deviceCreated', refetch as EventListener);
		eventSource.addEventListener('deviceDeleted', refetch as EventListener);
		eventSource.addEventListener('deviceUpdate', updateDevice);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('deviceCreated', refetch as EventListener);
			eventSource.removeEventListener('deviceDeleted', refetch as EventListener);
			eventSource.removeEventListener('deviceUpdate', updateDevice);
		};
	}, [isSorted, page, queryClient, refetch, search]);

	const setNextPage = useCallback(() => setPage(prevState => prevState + 1), []);
	const setPrevPage = useCallback(() => setPage(prevState => prevState - 1), []);
	const isPrevStepDisabled = isFetching || page === 1;
	const isNextStepDisabled = isFetching || (data?.data.total ?? 0) <= (page + 1) * BASE_LIMIT;

	return useMemo(
		() => ({
			data: data?.data.items || [],
			isInitFetching: isFetching && !data,
			paginationData: { setNextPage, setPrevPage, page, isPrevStepDisabled, isNextStepDisabled },
		}),
		[data, isFetching, isNextStepDisabled, isPrevStepDisabled, page, setNextPage, setPrevPage]
	);
};
