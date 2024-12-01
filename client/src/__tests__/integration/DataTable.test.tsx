import 'eventsource-polyfill';
import { ReactNode } from 'react';
import { FilteringContext } from '@/providers/FilteringContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { BASE_URL, initialFilters } from '@/constants';
import { mockDevices } from '@/mocks/mockDevices.ts';

const server = setupServer(
	http.get(`${BASE_URL}/devices`, async ({ request }) => {
		const url = new URL(request.url);
		const filteredId = url.searchParams.get('filter_by');
		if (filteredId) {
			return HttpResponse.json({
				items: [
					{
						id: filteredId,
						type: 'efoy_80',
						name: 'moVCVFiXgfxnqamhLPOtWDSARjNXaskk',
						state: 'charging',
					},
				],
				total: 1,
				limit: 10,
				offset: 10,
			});
		}
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

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<FilteringContext.Provider value={{ filters: initialFilters, onFilterChange: vi.fn(), setFilters: vi.fn() }}>
			{children}
		</FilteringContext.Provider>
	</QueryClientProvider>
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DataTable', () => {
	it('should show loading skeleton during data fetch', async () => {
		render(<DataTable />, { wrapper });

		expect(screen.getAllByTestId('skeleton')).toHaveLength(4);

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});

	it('should render table with column headers', async () => {
		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		['ID', 'Name', 'Type', 'State', 'Manage device mode'].forEach(headerName => {
			expect(screen.getByText(headerName)).toBeInTheDocument();
		});
	});

	it('should render table data', async () => {
		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		mockDevices.items
			.map(item => item.id)
			.forEach(id => {
				expect(screen.getByText(id)).toBeInTheDocument();
			});
	});

	it('should show "No results" when no data is available', async () => {
		server.use(
			http.get(`${BASE_URL}/devices`, async () => {
				return HttpResponse.json({ data: { items: [], total: 0 } });
			})
		);

		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		await waitFor(() => {
			expect(screen.getByText('No results.')).toBeInTheDocument();
		});
	});

	it('should sort data by ascending order when a `Id` ascending sort icon is clicked once', async () => {
		server.use(
			http.get(`${BASE_URL}/devices`, async ({ request }) => {
				const url = new URL(request.url);
				const sortBy = url.searchParams.get('sortBy');
				const sortDesc = url.searchParams.get('sortDesc');

				const sortedDevices = [...mockDevices.items];

				if (sortBy === 'id') {
					sortedDevices.sort((a, b) => {
						const comparison = a.id.localeCompare(b.id);
						return sortDesc === 'true' ? -comparison : comparison;
					});
				}

				return HttpResponse.json({
					items: sortedDevices,
					total: mockDevices.total,
					limit: mockDevices.limit,
					offset: mockDevices.offset,
				});
			})
		);

		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		const [sortButton] = screen.getAllByTestId('sort-switch-asc');
		expect(sortButton).toBeInTheDocument();

		sortButton && fireEvent.click(sortButton);

		await waitFor(() => {
			const rows = screen.getAllByRole('row').slice(1);
			const ids = rows.map(row => {
				const idCell = row.querySelector('td:nth-child(2)');
				return idCell ? idCell.textContent : '';
			});

			const sortedIds = [...mockDevices.items].sort((a, b) => a.id.localeCompare(b.id)).map(device => device.id);
			expect(ids).toStrictEqual(sortedIds);
		});
	});

	it('should disable sorting when the same sort icon is clicked twice', async () => {
		server.use(
			http.get(`${BASE_URL}/devices`, async ({ request }) => {
				const url = new URL(request.url);
				const sortBy = url.searchParams.get('sortBy');
				if (sortBy) {
					return HttpResponse.json(mockDevices);
				}

				return HttpResponse.json(mockDevices);
			})
		);

		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		const [ascSortButton] = screen.getAllByTestId('sort-switch-asc');
		expect(ascSortButton).toBeInTheDocument();

		fireEvent.click(ascSortButton);

		fireEvent.click(ascSortButton);

		await waitFor(() => {
			const rows = screen.getAllByRole('row').slice(1);
			const ids = rows.map(row => {
				const idCell = row.querySelector('td:nth-child(2)');
				return idCell ? idCell.textContent : '';
			});

			const originalIds = mockDevices.items.map(device => device.id);

			expect(ids).toStrictEqual(originalIds);
		});
	});
});
