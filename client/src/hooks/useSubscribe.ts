import { MutableRefObject, useCallback, useEffect } from 'react';
import { Device, DeviceDataType } from '@/types.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { BASE_URL } from '@/constants.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

	const updateDevice = useCallback(
		(evt: MessageEvent) => {
			const updatedDevice: Device = JSON.parse(evt.data);
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
};
