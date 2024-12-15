import { MutableRefObject, useCallback, useContext, useEffect } from 'react';
import { Device, DeviceDataType, Filter, Sort } from '@/types.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { BASE_URL } from '@/constants.ts';
import { useQueryClient } from '@tanstack/react-query';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';

type UseSubscribe = MutableRefObject<{
	page: number;
	filters: Filter[];
	sort: Sort;
	limit: number;
}>;

export const useSubscribe = (paramsRef: UseSubscribe) => {
	const queryClient = useQueryClient();
	const { updateStatistics } = useContext(StatisticsContext);

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
