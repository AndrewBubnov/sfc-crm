import { useCallback, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';
import { useLatest } from '@/modules/table/hooks/useLatest.ts';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';
import { Device, DeviceDataType } from '@/types.ts';
import { usePagination } from '@/modules/pagination/hooks/usePagination.ts';
import { BASE_URL } from '@/modules/shared/constants.ts';

export const useSubscribe = () => {
	const queryClient = useQueryClient();
	const { updateStatistics } = useContext(StatisticsContext);
	const { filters, sort, limit } = useManageSearchParams();
	const { page } = usePagination();

	const paramsRef = useLatest({ page, sort, limit, filters });

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data).event;
			const { page, sort, limit, filters } = paramsRef.current;
			queryClient.setQueryData([QueryKeys.Devices, page, sort, limit, filters], (oldData?: DeviceDataType) => {
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
		},
		[paramsRef, queryClient]
	);

	const updateItems = useCallback(
		(evt: MessageEvent) => {
			const updatedItems: Device = JSON.parse(evt.data).items;
			const { page, sort, limit, filters } = paramsRef.current;
			queryClient.setQueryData([QueryKeys.Devices, page, sort, limit, filters], (oldData?: DeviceDataType) => {
				if (!oldData) return oldData;
				return { ...oldData, data: { ...oldData.data, items: updatedItems } };
			});
		},
		[paramsRef, queryClient]
	);

	useEffect(() => {
		const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);

		const eventsListener = (event: MessageEvent) => {
			updateItems(event);
			updateStatistics(event);
		};

		const updateListener = (event: MessageEvent) => {
			updateStatistics(event);
			updateDevice(event);
		};

		eventSource.addEventListener('updateStats', updateStatistics);
		eventSource.addEventListener('deviceCreated', eventsListener);
		eventSource.addEventListener('deviceDeleted', eventsListener);
		eventSource.addEventListener('multipleDevicesDeleted', eventsListener);
		eventSource.addEventListener('registerDevice', eventsListener);
		eventSource.addEventListener('deviceUpdate', updateListener);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('updateStats', updateStatistics);
			eventSource.removeEventListener('deviceCreated', eventsListener);
			eventSource.removeEventListener('deviceDeleted', eventsListener);
			eventSource.removeEventListener('multipleDevicesDeleted', eventsListener);
			eventSource.removeEventListener('registerDevice', eventsListener);
			eventSource.removeEventListener('deviceUpdate', updateListener);
		};
	}, [updateDevice, updateItems, updateStatistics]);
};
