import 'eventsource-polyfill';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData';
import { BASE_URL, initialFilters } from '@/constants';
import { ReactNode } from 'react';
import { mockDevices } from '@/mocks/mockDevices.ts';
import { FilteringContext } from '@/providers/FilteringContext';

const mockFetchFn = vi.fn();

const server = setupServer(
	http.get(`${BASE_URL}/devices`, async () => {
		mockFetchFn();
		return HttpResponse.json(mockDevices);
	}),
	http.get(`${BASE_URL}/subscribe-device-changes`, () => {
		return new Response(null, {
			headers: {
				'Content-Type': 'text/event-stream',
			},
		});
	})
);

const defaultArgs = { sortBy: '', sortDesc: false };

describe('usePaginatedDeviceListData', () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<FilteringContext.Provider value={{ filters: initialFilters, onFilterChange: vi.fn() }}>
				{children}
			</FilteringContext.Provider>
		</QueryClientProvider>
	);

	beforeAll(() => server.listen());

	beforeEach(() => {
		queryClient.clear();
	});

	afterEach(() => {
		server.resetHandlers();
	});

	afterAll(() => {
		server.close();
	});

	it('should fetch initial device data', async () => {
		const { result } = renderHook(() => usePaginatedDeviceListData(defaultArgs), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.data).toHaveLength(mockDevices.items.length);
		});

		expect(result.current.data).toEqual(mockDevices.items);
	});

	it('should update device data on `deviceUpdate` event', async () => {
		const { result } = renderHook(() => usePaginatedDeviceListData(defaultArgs), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		const updatedDevice = { id: '0dE842aB1e6Dd6Af', name: 'moVCVFiXgfxnqamhLPOtWDSARjNXaskk' };

		act(() => {
			window.dispatchEvent(
				new MessageEvent('deviceUpdate', {
					data: JSON.stringify(updatedDevice),
				})
			);
		});

		await waitFor(() => {
			const updatedDeviceInList = result.current.data.find(device => device.id === updatedDevice.id);
			expect(updatedDeviceInList).toBeDefined();
			expect(updatedDeviceInList?.name).toBe(updatedDevice.name);
		});
	});

	it('should handle pagination correctly', async () => {
		const { result } = renderHook(() => usePaginatedDeviceListData(defaultArgs), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

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
		const { result } = renderHook(() => usePaginatedDeviceListData(defaultArgs), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		act(() => {
			window.dispatchEvent(new Event('deviceCreated'));
		});

		await waitFor(() => {
			expect(mockFetchFn).toHaveBeenCalled();
			expect(result.current.data).toHaveLength(mockDevices.items.length);
		});
	});
});
