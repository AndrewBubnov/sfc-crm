import 'eventsource-polyfill';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData';
import { BASE_URL } from '@/constants';
import { ReactNode } from 'react';
import { mockDevices } from '@/mocks/mockDevices.ts';

const mockFetchFn = vi.fn();

const server = setupServer(
	http.get(`${BASE_URL}/devices`, async () => {
		mockFetchFn();
		return HttpResponse.json(mockDevices);
	})
);

describe('usePaginatedDeviceListData', () => {
	const queryClient = new QueryClient();
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	it('should fetch initial device data', async () => {
		const { result } = renderHook(
			() => usePaginatedDeviceListData({ sortBy: '', sortDesc: false, searchField: '' }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.data).toHaveLength(mockDevices.items.length);
		});

		expect(result.current.data).toEqual(mockDevices.items);
	});

	it('should update device data on `deviceUpdate` event', async () => {
		const { result } = renderHook(
			() => usePaginatedDeviceListData({ sortBy: '', sortDesc: false, searchField: '' }),
			{ wrapper }
		);

		act(() => {
			const event = new MessageEvent('deviceUpdate', {
				data: JSON.stringify({ id: '1', name: 'Updated Device 1' }),
			});
			const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);
			eventSource.dispatchEvent(event);
		});

		await waitFor(() => {
			expect(result.current.data[0]).toStrictEqual(mockDevices.items[0]);
		});
	});

	it('should handle pagination correctly', async () => {
		const { result } = renderHook(
			() => usePaginatedDeviceListData({ sortBy: '', sortDesc: false, searchField: '' }),
			{ wrapper }
		);

		act(() => {
			result.current.paginationData.setNextPage();
		});

		await waitFor(() => {
			expect(result.current.paginationData.page).toBe(2);
		});

		act(() => {
			result.current.paginationData.setPrevPage();
		});

		await waitFor(() => {
			expect(result.current.paginationData.page).toBe(1);
		});
	});

	it('should re-fetch data on deviceCreated event', async () => {
		const { result } = renderHook(
			() => usePaginatedDeviceListData({ sortBy: '', sortDesc: false, searchField: '' }),
			{ wrapper }
		);

		act(() => {
			const event = new Event('deviceCreated');
			const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);
			eventSource.dispatchEvent(event);
		});

		await waitFor(() => {
			expect(mockFetchFn).toHaveBeenCalled();
			expect(result.current.data).toHaveLength(mockDevices.items.length);
		});
	});
});
