import { MutableRefObject, useCallback, useContext, useEffect } from 'react';
import { Device, DeviceDataType, Filter } from '@/types.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { BASE_URL } from '@/constants.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';

type UseSubscribe = {
	paramsRef: MutableRefObject<{
		page: number;
		filters: Filter[];
		sortBy: string;
		sortDesc: boolean;
		limit: number;
	}>;
	refetch: ReturnType<typeof useQuery>['refetch'];
};

export const useSubscribe = ({ paramsRef, refetch }: UseSubscribe) => {
	const queryClient = useQueryClient();
	const { updateStatistics } = useContext(StatisticsContext);

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data).event;
			const { page, sortBy, sortDesc, limit, filters } = paramsRef.current;
			queryClient.setQueryData(
				[QueryKeys.Devices, page, sortBy, sortDesc, limit, filters],
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

		const fetchListener = (event: MessageEvent) => {
			updateStatistics(event);
			refetch();
		};

		const updateListener = (event: MessageEvent) => {
			updateStatistics(event);
			updateDevice(event);
		};

		eventSource.addEventListener('updateStats', updateStatistics);
		eventSource.addEventListener('deviceCreated', fetchListener);
		eventSource.addEventListener('deviceDeleted', fetchListener);
		eventSource.addEventListener('multipleDevicesDeleted', fetchListener);
		eventSource.addEventListener('registerDevice', fetchListener);
		eventSource.addEventListener('deviceUpdate', updateListener);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('updateStats', updateStatistics);
			eventSource.removeEventListener('deviceCreated', fetchListener);
			eventSource.removeEventListener('deviceDeleted', fetchListener);
			eventSource.removeEventListener('multipleDevicesDeleted', fetchListener);
			eventSource.removeEventListener('registerDevice', fetchListener);
			eventSource.removeEventListener('deviceUpdate', updateListener);
		};
	}, [refetch, updateDevice, updateStatistics]);
};
