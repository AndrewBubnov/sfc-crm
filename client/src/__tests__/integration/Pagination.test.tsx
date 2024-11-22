import 'eventsource-polyfill';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/Pagination';

describe('Pagination', () => {
	const mockSetNextPage = vi.fn();
	const mockSetPrevPage = vi.fn();
	const mockSetPage = vi.fn();
	const mockOnChangeLimit = vi.fn();

	const defaultProps = {
		paginationData: {
			page: 1,
			setNextPage: mockSetNextPage,
			setPrevPage: mockSetPrevPage,
			isPrevStepDisabled: false,
			isNextStepDisabled: false,
			setPage: mockSetPage,
			lastPage: 10,
			limit: 10,
			onChangeLimit: mockOnChangeLimit,
		},
		isLoading: false,
	};

	it('renders `first`, `previous`, `next` and `last` buttons correctly', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.getByTestId('pagination-first-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-previous-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-next-button')).toBeInTheDocument();
		expect(screen.getByTestId('pagination-last-button')).toBeInTheDocument();
	});

	it('calls `setPrevPage` when `previous` button is clicked', () => {
		render(<Pagination {...defaultProps} />);

		const prevButton = screen.getByTestId('pagination-previous-button');
		fireEvent.click(prevButton);
		expect(mockSetPrevPage).toHaveBeenCalled();
	});

	it('calls `setNextPage` when `next` button is clicked', () => {
		render(<Pagination {...defaultProps} />);

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

	it('disables `next` button when isNextStepDisabled is true', () => {
		render(
			<Pagination
				{...{
					...defaultProps,
					paginationData: { ...defaultProps.paginationData, isNextStepDisabled: true },
				}}
			/>
		);

		const nextButton = screen.getByTestId('pagination-next-button');
		expect(nextButton).toBeDisabled();
	});

	it('displays `Skeleton` loader when isLoading is true', () => {
		render(<Pagination {...{ ...defaultProps, isLoading: true }} />);

		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('does not display `Skeleton` loader when isLoading is false', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});

	it('displays the current page number', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.getByText('1')).toBeInTheDocument();
	});
});
