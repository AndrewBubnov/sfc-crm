import 'eventsource-polyfill';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants';
import { mockDevices } from '@/mocks/mockDevices.ts';
import { ReactNode } from 'react';

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
	})
);

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DataTable', () => {
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

	it('should allow searching devices', async () => {
		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		const searchInput = screen.getByPlaceholderText('Search by name...');
		fireEvent.change(searchInput, { target: { value: 'Device 1' } });

		await waitFor(() => {
			expect(screen.getByText('Device 1')).toBeInTheDocument();
		});

		expect(screen.queryByText('Device 2')).not.toBeInTheDocument();
	});

	it.todo('should toggle sorting on click', async () => {
		render(<DataTable />, { wrapper });

		await waitFor(() => screen.getByText(mockDevices.items[0].name));

		const sortButton = screen.getByRole('button', { name: /Enable sorting/i });
		fireEvent.click(sortButton);

		expect(sortButton).toHaveTextContent('Disable sorting');

		fireEvent.click(sortButton);
		expect(sortButton).toHaveTextContent('Enable sorting');
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

	it.todo('should handle pagination correctly', async () => {
		render(<DataTable />, { wrapper });

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		const nextPageButton = screen.getByRole('button', { name: /Next/i });
		fireEvent.click(nextPageButton);

		await waitFor(() => {
			expect(screen.getByText(mockDevices.items[0].name)).toBeInTheDocument();
		});

		const prevPageButton = screen.getByRole('button', { name: /Previous/i });
		fireEvent.click(prevPageButton);

		await waitFor(() => {
			expect(screen.getByText(mockDevices.items[0].name)).toBeInTheDocument();
		});
	});

	it.todo('should show loading skeleton during data fetch', async () => {
		render(<DataTable />, { wrapper });

		expect(screen.getAllByTestId('skeleton')).toHaveLength(3);

		await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});
});
