import 'eventsource-polyfill';
import { ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useData } from '@/modules/shared/hooks/useData.ts';
import { mockDevices } from '@/modules/table/mocks/mockDevices.ts';

import { BASE_URL } from '@/modules/shared/constants.ts';
import { SearchParamsProvider } from '@/providers/SearchParamsProvider.tsx';

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

describe('useData', () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<SearchParamsProvider>{children}</SearchParamsProvider>
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
		const { result } = renderHook(useData, {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.data).toHaveLength(mockDevices.items.length);
		});

		expect(result.current.data).toEqual(mockDevices.items);
	});

	it('should update device data on `deviceUpdate` event', async () => {
		const { result } = renderHook(useData, {
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

	it('should re-fetch data on deviceCreated event', async () => {
		const { result } = renderHook(useData, {
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
