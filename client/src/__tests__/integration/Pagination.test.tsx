import 'eventsource-polyfill';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/Pagination';
import { ReactElement, ReactNode } from 'react';
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

const mockSetPage = vi.fn();
const mockSetNextPage = vi.fn();
const mockSetPrevPage = vi.fn();

const createWrapper = (contextValue: PartialContextValue = {}) => {
	return ({ children }: { children: ReactNode }) => (
		<PaginatedDataContext.Provider
			value={
				{
					paginationData: {
						page: 1,
						setPage: mockSetPage,
						setNextPage: mockSetNextPage,
						setPrevPage: mockSetPrevPage,
						isPrevStepDisabled: false,
						isNextStepDisabled: false,
						lastPage: 5,
						isFetching: false,
						...contextValue.paginationData,
					},
					isInitFetching: contextValue.isInitFetching || false,
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

describe('Pagination', () => {
	it('should render `first`, `previous`, `next` and `last` buttons correctly', () => {
		renderWithContext(<Pagination />);
		expect(screen.getByTestId('pagination-first-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-previous-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-next-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-last-button')).toBeInTheDocument();
	});

	it('should call `setPrevPage` when `previous` button is clicked', () => {
		renderWithContext(<Pagination />);

		const prevButton = screen.getByTestId('pagination-previous-button');

		fireEvent.click(prevButton);
		expect(mockSetPrevPage).toHaveBeenCalled();
	});

	it('should call `setNextPage` when `next` button is clicked', () => {
		renderWithContext(<Pagination />);

		const nextButton = screen.getByTestId('pagination-next-button');
		fireEvent.click(nextButton);
		expect(mockSetNextPage).toHaveBeenCalled();
	});

	it('should disable `previous` button when isPrevStepDisabled is true', () => {
		renderWithContext(<Pagination />, { paginationData: { isPrevStepDisabled: true } });
		const prevButton = screen.getByTestId('pagination-previous-button');
		expect(prevButton).toBeDisabled();
	});

	it('should disable `next` button when `isNextStepDisabled` is true', () => {
		renderWithContext(<Pagination />, { paginationData: { isNextStepDisabled: true } });
		const nextButton = screen.queryByTestId('pagination-next-button');
		expect(nextButton).toBeDisabled();
	});

	it('should display `Skeleton` loader when `isLoading` is true', () => {
		renderWithContext(<Pagination />, { isInitFetching: true });
		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('should not display `Skeleton` loader when isLoading is false', () => {
		renderWithContext(<Pagination />, { isInitFetching: false });
		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});

	it('should display the current page number', () => {
		renderWithContext(<Pagination />);
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('should call `setPage` when page number is clicked', () => {
		renderWithContext(<Pagination />, {
			paginationData: {
				page: 1,
				lastPage: 3,
			},
		});

		fireEvent.click(screen.getByText('2'));
		expect(mockSetPage).toHaveBeenCalledWith(2);
	});

	it('should disable navigation buttons in `isFetching` state', () => {
		renderWithContext(<Pagination />, {
			paginationData: {
				page: 2,
				lastPage: 3,
				isFetching: true,
			},
		});

		expect(screen.getByTestId('pagination-next-button')).toBeDisabled();
		expect(screen.getByTestId('pagination-previous-button')).toBeDisabled();
	});
});
