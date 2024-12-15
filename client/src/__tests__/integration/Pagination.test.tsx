import 'eventsource-polyfill';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/Pagination';

import { PaginatedDataContext, PaginatedDataContextProps } from '@/providers/PaginatedDataContext.ts';
import { vi } from 'vitest';

interface PaginatedDataContextType {
	isFetching: boolean;
	isInitFetching: boolean;
}

type PartialContextValue = Partial<PaginatedDataContextType>;

const mockSetPageParam = vi.fn();
const mockSetNextPage = vi.fn();
const mockSetPrevPage = vi.fn();

const mockUseManageParamsReturnValue = {
	page: 1,
	setPageParam: mockSetPageParam,
	setNextPage: mockSetNextPage,
	setPrevPage: mockSetPrevPage,
	isPrevStepDisabled: false,
	isNextStepDisabled: false,
	lastPage: 5,
};

vi.mock('@/hooks/useManageParams.ts', () => ({
	useManageParams: () => mockUseManageParamsReturnValue,
}));

const createWrapper = (contextValue: PartialContextValue = {}) => {
	return ({ children }: { children: ReactNode }) => (
		<Router>
			<PaginatedDataContext.Provider
				value={
					{
						isInitFetching: contextValue.isInitFetching || false,
						isFetching: contextValue.isFetching || false,
					} as PaginatedDataContextProps
				}
			>
				{children}
			</PaginatedDataContext.Provider>
		</Router>
	);
};

const renderWithContext = (ui: ReactElement, contextValue: PartialContextValue = {}) => {
	return render(ui, {
		wrapper: createWrapper(contextValue),
	});
};

describe('Pagination', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});
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
		mockUseManageParamsReturnValue.isNextStepDisabled = false;
		renderWithContext(<Pagination />);

		const nextButton = screen.getByTestId('pagination-next-button');
		fireEvent.click(nextButton);
		expect(mockSetNextPage).toHaveBeenCalled();
	});

	it('should disable `previous` button when `isPrevStepDisabled` is true', () => {
		mockUseManageParamsReturnValue.isPrevStepDisabled = true;
		renderWithContext(<Pagination />);
		const prevButton = screen.getByTestId('pagination-previous-button');
		expect(prevButton).toBeDisabled();
	});

	it('should disable `next` button when `isNextStepDisabled` is true', () => {
		mockUseManageParamsReturnValue.isNextStepDisabled = true;
		renderWithContext(<Pagination />);
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
		mockUseManageParamsReturnValue.lastPage = 3;
		renderWithContext(<Pagination />);

		fireEvent.click(screen.getByText('2'));
		expect(mockSetPageParam).toHaveBeenCalledWith(2);
	});

	it('should disable navigation buttons in `isFetching` state', () => {
		renderWithContext(<Pagination />, {
			isFetching: true,
		});

		expect(screen.getByTestId('pagination-next-button')).toBeDisabled();
		expect(screen.getByTestId('pagination-previous-button')).toBeDisabled();
	});
});
