import 'eventsource-polyfill';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/Pagination';
import { ReactElement, ReactNode } from 'react';
import { PaginatedDataProvider } from '@/providers/PaginatedDataProvider.tsx';
import { TableProvider } from '@/providers/TableProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaginatedDataContext, PaginatedDataContextProps } from '@/providers/PaginatedDataContext.ts';

interface PaginationData {
	page: number;
	setPage: (page: number) => void;
	setNextPage: () => void;
	setPrevPage: () => void;
	isPrevStepDisabled: boolean;
	isNextStepDisabled: boolean;
	lastPage: number;
	isFetching: boolean;
}

interface PaginatedDataContextType {
	paginationData: PaginationData;
	isInitFetching: boolean;
}

type PartialContextValue = DeepPartial<PaginatedDataContextType>;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const createWrapper = (contextValue: PartialContextValue = {}) => {
	return ({ children }: { children: ReactNode }) => (
		<PaginatedDataContext.Provider
			value={
				{
					paginationData: {
						page: 1,
						setPage: vi.fn(),
						setNextPage: vi.fn(),
						setPrevPage: vi.fn(),
						isPrevStepDisabled: false,
						isNextStepDisabled: false,
						lastPage: 5,
						isFetching: false,
						...contextValue.paginationData,
					},
					isInitFetching: false,
					...contextValue,
				} as PaginatedDataContextProps
			}
		>
			{children}
		</PaginatedDataContext.Provider>
	);
};

const renderWithContext = (ui: ReactElement, contextValue: PartialContextValue = {}) => {
	return render(ui, {
		wrapper: createWrapper(contextValue),
	});
};

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<PaginatedDataProvider>
			<TableProvider>{children}</TableProvider>
		</PaginatedDataProvider>
	</QueryClientProvider>
);

describe('Pagination', () => {
	const mockSetNextPage = vi.fn();
	const mockSetPrevPage = vi.fn();

	it('renders `first`, `previous`, `next` and `last` buttons correctly', () => {
		renderWithContext(<Pagination />);
		expect(screen.getByTestId('pagination-first-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-previous-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-next-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-last-button')).toBeInTheDocument();
	});

	it('calls `setPrevPage` when `previous` button is clicked', () => {
		renderWithContext(<Pagination />);

		const prevButton = screen.getByTestId('pagination-previous-button');

		fireEvent.click(prevButton);
		expect(mockSetPrevPage).toHaveBeenCalled();
	});

	it('calls `setNextPage` when `next` button is clicked', () => {
		renderWithContext(<Pagination />);

		const nextButton = screen.getByTestId('pagination-next-button');
		fireEvent.click(nextButton);
		expect(mockSetNextPage).toHaveBeenCalled();
	});

	it('disables `previous` button when isPrevStepDisabled is true', () => {
		render(
			<Pagination
				{...{
					...defaultProps,
					paginationData: { ...defaultProps.paginationData, isPrevStepDisabled: true },
				}}
			/>
		);

		const prevButton = screen.getByTestId('pagination-previous-button');
		expect(prevButton).toBeDisabled();
	});

	it('disables `next` button when `isNextStepDisabled` is true', () => {
		renderWithContext(<Pagination />, { paginationData: { isNextStepDisabled: true } });

		const nextButton = screen.queryByTestId('pagination-next-button');
		console.log(nextButton);
		expect(nextButton).toBeDisabled();
	});

	it('displays `Skeleton` loader when `isLoading` is true', () => {
		renderWithContext(<Pagination />, { isInitFetching: true });

		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('does not display `Skeleton` loader when isLoading is false', () => {
		render(<Pagination />, { wrapper });
		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});

	it('displays the current page number', () => {
		render(<Pagination />, { wrapper });
		expect(screen.getByText('1')).toBeInTheDocument();
	});
});
