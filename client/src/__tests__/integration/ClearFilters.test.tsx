import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ClearFilters } from '@/modules/controls/components/ClearFilters.tsx';

vi.mock('../hooks/useManageSearchParams');

let useManageSearchParamsReturnValue = {
	filters: [
		{ field: 'name', search: 'John' },
		{ field: 'type', search: '' },
	],
	resetFilters: vi.fn(),
};

vi.mock('@/modules/shared/hooks/useManageSearchParams.ts', () => ({
	useManageSearchParams: () => useManageSearchParamsReturnValue,
}));

describe('ClearFilters', () => {
	it('should render button when there are active filters', () => {
		render(<ClearFilters />);

		expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
		expect(screen.getByText(/name/i)).toBeInTheDocument();
	});

	it('should not render anything when there are no active filters', () => {
		useManageSearchParamsReturnValue.filters = [
			{ field: 'name', search: '' },
			{ field: 'type', search: '' },
		];

		render(<ClearFilters />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('should call resetFilters when button is clicked', () => {
		const resetFiltersMock = vi.fn();
		useManageSearchParamsReturnValue = {
			filters: [
				{ field: 'name', search: 'John' },
				{ field: 'type', search: 'Admin' },
			],
			resetFilters: resetFiltersMock,
		};

		render(<ClearFilters />);

		const button = screen.getByRole('button', { name: /clear all filters/i });
		fireEvent.click(button);

		expect(resetFiltersMock).toHaveBeenCalled();
	});

	it('should list all active filters in the button text', () => {
		useManageSearchParamsReturnValue.filters = [
			{ field: 'name', search: 'John' },
			{ field: 'type', search: 'Admin' },
		];

		render(<ClearFilters />);

		expect(screen.getByText(/name, type/i)).toBeInTheDocument();
	});

	it('should correctly render with a single active filter', () => {
		useManageSearchParamsReturnValue.filters = [{ field: 'id', search: '123' }];

		render(<ClearFilters />);

		expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
		expect(screen.getByText(/id/i)).toBeInTheDocument();
	});
});
