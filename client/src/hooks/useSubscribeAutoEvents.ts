import { useEffect } from 'react';
import { BASE_URL } from '@/constants.ts';
import { useQuery } from '@tanstack/react-query';

export const useSubscribeAutoEvents = (refetch: ReturnType<typeof useQuery>['refetch']) => {
	useEffect(() => {
		const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);

		eventSource.addEventListener('deviceCreated', refetch as EventListener);
		eventSource.addEventListener('deviceDeleted', refetch as EventListener);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('deviceCreated', refetch as EventListener);
			eventSource.removeEventListener('deviceDeleted', refetch as EventListener);
		};
	}, [refetch]);
};
