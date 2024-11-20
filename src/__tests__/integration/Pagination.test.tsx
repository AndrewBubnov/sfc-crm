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

	it('renders Previous and Next buttons correctly', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.getByText('Previous')).toBeInTheDocument();
		expect(screen.getByText('Next')).toBeInTheDocument();
	});

	it('calls setPrevPage when Previous button is clicked', () => {
		render(<Pagination {...defaultProps} />);

		const prevButton = screen.getByText('Previous');
		fireEvent.click(prevButton);
		expect(mockSetPrevPage).toHaveBeenCalled();
	});

	it('calls setNextPage when Next button is clicked', () => {
		render(<Pagination {...defaultProps} />);

		const nextButton = screen.getByText('Next');
		fireEvent.click(nextButton);
		expect(mockSetNextPage).toHaveBeenCalled();
	});

	it('disables Previous button when isPrevStepDisabled is true', () => {
		render(
			<Pagination
				{...{
					...defaultProps,
					paginationData: { ...defaultProps.paginationData, isPrevStepDisabled: true },
				}}
			/>
		);

		const prevButton = screen.getByText('Previous');
		expect(prevButton).toBeDisabled();
	});

	it('disables Next button when isNextStepDisabled is true', () => {
		render(
			<Pagination
				{...{
					...defaultProps,
					paginationData: { ...defaultProps.paginationData, isNextStepDisabled: true },
				}}
			/>
		);

		const nextButton = screen.getByText('Next');
		expect(nextButton).toBeDisabled();
	});

	it('displays Skeleton loader when isLoading is true', () => {
		render(<Pagination {...{ ...defaultProps, isLoading: true }} />);

		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('does not display Skeleton loader when isLoading is false', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});

	it('displays the current page number', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.getByText('1')).toBeInTheDocument();
	});
});
