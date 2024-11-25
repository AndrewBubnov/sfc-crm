import { MutableRefObject, useCallback, useContext, useEffect } from 'react';
import { Device, DeviceDataType } from '@/types.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { BASE_URL } from '@/constants.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';

type UseSubscribe = {
	paramsRef: MutableRefObject<{
		page: number;
		search: string | undefined;
		sortBy: string;
		sortDesc: boolean;
		limit: number;
		searchField: string;
	}>;
	refetch: ReturnType<typeof useQuery>['refetch'];
};

export const useSubscribe = ({ paramsRef, refetch }: UseSubscribe) => {
	const queryClient = useQueryClient();
	const { updateStatistics } = useContext(StatisticsContext);

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data).event;
			const { page, search, sortBy, sortDesc, limit, searchField } = paramsRef.current;
			queryClient.setQueryData(
				[QueryKeys.Devices, page, sortBy, sortDesc, limit, search, searchField],
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

		const autoEventListener = (event: MessageEvent) => {
			updateStatistics(event);
			refetch();
		};

		const updateListener = (event: MessageEvent) => {
			updateStatistics(event);
			updateDevice(event);
		};

		eventSource.addEventListener('connected', updateStatistics);
		eventSource.addEventListener('deviceCreated', autoEventListener);
		eventSource.addEventListener('deviceDeleted', autoEventListener);
		eventSource.addEventListener('deviceUpdate', updateListener);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('connected', updateStatistics);
			eventSource.removeEventListener('deviceCreated', autoEventListener);
			eventSource.removeEventListener('deviceDeleted', autoEventListener);
			eventSource.removeEventListener('deviceUpdate', updateListener);
		};
	}, [refetch, updateDevice, updateStatistics]);
};
