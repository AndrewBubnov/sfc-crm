import 'eventsource-polyfill';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/Pagination';

import { vi } from 'vitest';

const mockSetPage = vi.fn();
const mockSetNextPage = vi.fn();
const mockSetPrevPage = vi.fn();

const mockUsePaginationReturnValue = {
	page: 1,
	setPage: mockSetPage,
	setNextPage: mockSetNextPage,
	setPrevPage: mockSetPrevPage,
	isPrevStepDisabled: false,
	isNextStepDisabled: false,
	lastPage: 5,
};

const mockUseGetQueryDetailsReturnValue = {
	isFetching: false,
	isInitFetching: false,
};

vi.mock('@/hooks/usePagination.ts', () => ({
	usePagination: () => mockUsePaginationReturnValue,
}));

vi.mock('@/hooks/useGetQueryDetails.ts', () => ({
	useGetQueryDetails: () => mockUseGetQueryDetailsReturnValue,
}));

const wrapper = ({ children }: { children: ReactNode }) => <Router>{children}</Router>;

const renderWithRouter = (ui: ReactElement) => {
	return render(ui, { wrapper });
};

describe('Pagination', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});
	it('should render `first`, `previous`, `next` and `last` buttons correctly', () => {
		renderWithRouter(<Pagination />);
		expect(screen.getByTestId('pagination-first-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-previous-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-next-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-last-button')).toBeInTheDocument();
	});

	it('should call `setPrevPage` when `previous` button is clicked', () => {
		renderWithRouter(<Pagination />);

		const prevButton = screen.getByTestId('pagination-previous-button');

		fireEvent.click(prevButton);
		expect(mockSetPrevPage).toHaveBeenCalled();
	});

	it('should call `setNextPage` when `next` button is clicked', () => {
		mockUsePaginationReturnValue.isNextStepDisabled = false;
		renderWithRouter(<Pagination />);

		const nextButton = screen.getByTestId('pagination-next-button');
		fireEvent.click(nextButton);
		expect(mockSetNextPage).toHaveBeenCalled();
	});

	it('should disable `previous` button when `isPrevStepDisabled` is true', () => {
		mockUsePaginationReturnValue.isPrevStepDisabled = true;
		renderWithRouter(<Pagination />);
		const prevButton = screen.getByTestId('pagination-previous-button');
		expect(prevButton).toBeDisabled();
	});

	it('should disable `next` button when `isNextStepDisabled` is true', () => {
		mockUsePaginationReturnValue.isNextStepDisabled = true;
		renderWithRouter(<Pagination />);
		const nextButton = screen.queryByTestId('pagination-next-button');
		expect(nextButton).toBeDisabled();
	});

	it('should display `Skeleton` loader when `isLoading` is true', () => {
		mockUseGetQueryDetailsReturnValue.isInitFetching = true;
		renderWithRouter(<Pagination />);
		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('should not display `Skeleton` loader when isLoading is false', () => {
		mockUseGetQueryDetailsReturnValue.isInitFetching = false;
		renderWithRouter(<Pagination />);
		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});

	it('should display the current page number', () => {
		renderWithRouter(<Pagination />);
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('should call `setPage` when page number is clicked', () => {
		mockUsePaginationReturnValue.lastPage = 3;
		renderWithRouter(<Pagination />);

		fireEvent.click(screen.getByText('2'));
		expect(mockSetPage).toHaveBeenCalledWith(2);
	});

	it('should disable navigation buttons in `isFetching` state', () => {
		mockUseGetQueryDetailsReturnValue.isFetching = true;
		renderWithRouter(<Pagination />);

		expect(screen.getByTestId('pagination-next-button')).toBeDisabled();
		expect(screen.getByTestId('pagination-previous-button')).toBeDisabled();
	});
});
