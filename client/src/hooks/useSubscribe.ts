import { MutableRefObject, useCallback, useContext, useEffect } from 'react';
import { Device, Filter } from '@/types.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { BASE_URL } from '@/constants.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { useQuery, useQueryClient } from '@/react-mini-query';

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
	useEffect(() => {
		console.log('refetch');
	}, [refetch]);
	const queryClient = useQueryClient();
	const { updateStatistics } = useContext(StatisticsContext);

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data).event;
			const { page, sortBy, sortDesc, limit, filters } = paramsRef.current;
			queryClient.setQueryData([QueryKeys.Devices, page, sortBy, sortDesc, limit, filters], oldData => ({
				...oldData,
				data: {
					...oldData.data,
					data: {
						...oldData.data.data,
						items: oldData.data.data.items.map((device: Device) =>
							device.id === updatedDevice.id ? updatedDevice : device
						),
					},
				},
			}));
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
