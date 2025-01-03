import { ReactNode } from 'react';
import { SearchParamsContext, SearchParamsContextProps } from '@/providers/SearchParamsContext.ts';
import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClearFilters } from '@/modules/controls/components/ClearFilters.tsx';

let mockContextValue: Partial<SearchParamsContextProps> = {
	filters: [
		{ field: 'name', search: 'John' },
		{ field: 'type', search: '1' },
	],
	resetFilters: vi.fn(),
};

const createWrapper =
	(value: Partial<SearchParamsContextProps>) =>
	({ children }: { children: ReactNode }) => (
		<SearchParamsContext.Provider value={value as SearchParamsContextProps}>
			{children}
		</SearchParamsContext.Provider>
	);

describe('ClearFilters', () => {
	it('should render button when there are active filters', () => {
		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
		expect(screen.getByText(/name/i)).toBeInTheDocument();
	});

	it('should not render anything when there are no active filters', () => {
		mockContextValue.filters = [
			{ field: 'name', search: '' },
			{ field: 'type', search: '' },
		];

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('should call `resetFilters` when button is clicked', () => {
		const resetFiltersMock = vi.fn();
		mockContextValue = {
			filters: [
				{ field: 'name', search: 'John' },
				{ field: 'type', search: 'Admin' },
			],
			resetFilters: resetFiltersMock,
		};

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		const button = screen.getByRole('button', { name: /clear all filters/i });
		fireEvent.click(button);

		expect(resetFiltersMock).toHaveBeenCalled();
	});

	it('should list all tag buttons with active filters text', () => {
		mockContextValue.filters = [
			{ field: 'name', search: 'John' },
			{ field: 'type', search: 'Admin' },
		];

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.getByRole('button', { name: 'name' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'type' })).toBeInTheDocument();
	});

	it('should correctly render with a single active filter', () => {
		mockContextValue.filters = [{ field: 'id', search: '123' }];

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
		expect(screen.getByText(/id/i)).toBeInTheDocument();
	});
});
